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

        console.log("validating user")

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("validating group");


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

        console.log("existingConversations");
        const existingConversations = await prisma.conversation.findMany({
          where: {
            OR: [
              {
                userIds: {
                  equals: [currentUser.id, userId],
                },
              },
              {
                userIds: {
                  equals: [userId, currentUser.id],
                },
              },
            ],
          },
        });

      

        const singleConversation = existingConversations[0];
        console.log(singleConversation);
        if (singleConversation) {
            console.log("existingConversations");
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({    
            data:{
                users:{
                    connect:[{id:currentUser.id},{id:userId}]
                }
            },
            include:{
                users:true
            }
        })
        console.log("newConversation");

        return NextResponse.json(newConversation)
    }catch(error:any){
        console.log(error)
        return new NextResponse("Internal Error",{status:500})
    }
}