import dotevn from 'dotenv'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyIo from 'fastify-socket.io'
import Redis from 'ioredis'
import closeWithGrace from 'close-with-grace'


dotevn.config()

const PORT = parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST || '0.0.0.0'
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000"
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL

const CONNECTION_COUNT_KEY = "chat:connection-count"
const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"

if (!UPSTASH_REDIS_REST_URL) {
  console.error("missing UPSTASH_REDIS_REST_URL")
  process.exit(1)
}

const publisher = new Redis(UPSTASH_REDIS_REST_URL)
const subscriber = new Redis(UPSTASH_REDIS_REST_URL)

let connectedClients = 0

async function buildServer() {
  const app = fastify()

  await app.register(fastifyCors, {
    origin: CORS_ORIGIN
  })

  await app.register(fastifyIo)

  const currentCount = await publisher.get(CONNECTION_COUNT_KEY)

  if (!currentCount) {
    await publisher.set(CONNECTION_COUNT_KEY, 0)
  }

  app.io.on('connection', async (io) => {
    console.log("Client Connected")

    const incResult = await publisher.incr(CONNECTION_COUNT_KEY)

    connectedClients++

    await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(incResult))

    io.on("disconnect", async () => {
      console.log("Client Disconnected")

      const decrResult = await publisher.decr(CONNECTION_COUNT_KEY)

      connectedClients++

      await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(decrResult))
    })
  })

  subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
    if (err) {
      console.error(`Error subscribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`, err)
      return
    }

    console.log(`${count} clients connected to ${CONNECTION_COUNT_UPDATED_CHANNEL} channel`)
  })

  subscriber.on('message', (channel, text) => {
    if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
      app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
        count: text
      })
      return
    }
  })

  app.get("/healthcheck", () => {
    return {
      status: "ok",
      port: PORT
    }
  })

  return app
}

async function main() {
  const app = await buildServer()

  try {
    await app.listen({
      port: PORT,
      host: HOST
    })

    closeWithGrace({ delay: 2000 }, async () => {
      console.log("shutting down")

      if (connectedClients > 0) {
        console.log(`Removing ${connectedClients} from count`)

        const currentCount = parseInt(
          (await publisher.get(CONNECTION_COUNT_KEY)) || '0',
          10
        )

        const newCount = Math.max(currentCount - connectedClients, 0)

        await publisher.set(CONNECTION_COUNT_KEY, newCount)
      }

      await app.close()

      console.log('Shutdown complete, goodbye')
    })

    console.log(`Server started at https://${HOST}:${PORT}`)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

main()