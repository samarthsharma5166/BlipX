import prisma from '@/app/libs/prismaDb'

const getMessage = async (conversationId: string) => {
    try {
        const message = await prisma.message.findMany({
            where:{
                conversationId: conversationId
            },
            include:{
                sender:true,
                seen:true
            },
            orderBy:{
                createdAt:'asc'
            }
        })
        return message
    } catch (error) {
        console.log(error)
        return [];
    }
}

export default getMessage