import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismaDb';
import { pusherServer } from "@/app/libs/pusher";
interface Iparams{
    conversationId:string;
};


export async function POST(request:Request,{params}:{params:Iparams}){ 
    try {
        const currentUser = await getCurrentUser();
        const {conversationId} = await params;
        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse("Unauthorized", {status:401});
        }
        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                messages:{
                    include:{
                        seen:true
                    }
                },
                users:true
            }
        })

        if(!conversation){
            return new NextResponse('Invalid Id',{status:400});
        }

        const lastMessage = conversation.messages[conversation.messages.length-1];
        const updatedMessages = await prisma.message.update({
            where:{
                id:lastMessage?.id
            },
            include:{
                seen:true
            },
            data:{
                seen: {
                    connect:{
                        id:currentUser.id
                    }
                }
            }
        })

        await pusherServer.trigger(currentUser.email,'conversation:update',{
            id:conversationId,
            messages:[updatedMessages]
        });
 
        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!,'message:update',updatedMessages);

        return NextResponse.json(updatedMessages);

    } catch (error) {
        console.log(error,"ERROR_MESSAGES_SEEN");
        return new NextResponse("Internal Error", {status:500});
    }
}