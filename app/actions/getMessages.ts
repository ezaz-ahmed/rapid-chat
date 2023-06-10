import prisma from '~/app/libs/prismadb'

const getMessages = async (conversaionId: string) => {
  try {
    return await prisma.message.findMany({
      where: {
        conversationId: conversaionId
      },
      include: {
        sender: true,
        seen: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  } catch (error: any) {
    return []
  }
}

export default getMessages