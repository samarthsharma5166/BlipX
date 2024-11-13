import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismaDb'

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (isGroup && (!members  || members.length<2 || !name)){
            return new NextResponse("Invalid Data", {status:400});
        }

        if(isGroup){
            const newConversation = await prisma.conversation.create({
                data:{
                    name,
                    isGroup,
                    users:{
                        connect:[
                            ...members.map((member: { value: string }) => ({
                                id:member.value
                            })),
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                include:{
                    users:true
                }
            })
            return NextResponse.json(newConversation)
        }   
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR:[
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    }
                ]
            }
        })
    }catch(error:any){
        console.log(error)
        return new NextResponse("Internal Error",{status:500})
    }
}