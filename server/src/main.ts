import dotevn from 'dotenv'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyIo from 'fastify-socket.io'


dotevn.config()

const PORT = parseInt(process.env.PORT || '3001', 10)
const HOST = process.env.HOST || '0.0.0.0'
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000"
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL

if (!UPSTASH_REDIS_REST_URL) {
  console.error("missing UPSTASH_REDIS_REST_URL")
  process.exit(1)
}

async function buildServer() {
  const app = fastify()

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

  await app.register(fastifyCors, {
    origin: CORS_ORIGIN
  })

  await app.register(fastifyIo)

  app.io.on('connection', (io) => {
    console.log("Client Connected")


    io.on("disconnect", () => {
      console.log("Client Disconnected")
    })
  })

  try {
    await app.listen({
      port: PORT,
      host: HOST
    })

    console.log(`Server started at https://${HOST}:${PORT}`)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

main()