import getCurrentUser from "@/app/actions/getCurrentUser";
import  prisma from "@/app/libs/prismaDb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server"

interface Iparams {
    conversationId:string
}

export async function DELETE(request:Request,{params}:{params:Iparams}){
    try {
        const {conversationId} = params;   
        const currentUser = await getCurrentUser();

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse("Unauthorized", {status:401});
        }

        const existingConversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                users:true
            }
        })

        if(!existingConversation){
            return new NextResponse("Invalid Id", {status:400})
        }

        const delteConversation = await prisma.conversation.deleteMany({
            where:{
                id:conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.users.forEach(user => {
            if(user.email){
                pusherServer.trigger(
                    user.email,
                    'conversation:remove',
                    existingConversation
                )
            }
        })
        return NextResponse.json(delteConversation);

    } catch (error) {
        console.log(error,"Error Deleting Conversation")
        return new NextResponse("Internal Error", {status:500})
    }
}