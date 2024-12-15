import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismaDb";

export async function POST(request:Request){
    try {
        const currentUser = await getCurrentUser();
        console.log("current user from setting",currentUser);
        const body= await request.json();
        const{name,image} = body;
        if(!currentUser?.id){
            return new NextResponse('Unauthorized', {status:401});
        }
        const updateUser = await prisma.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                image:image, 
                name:name
            }
        })
        return NextResponse.json(updateUser);
    } catch (error) {
        console.log(error,"setting error");
        return new NextResponse('Internal Error',{status:500});
    }
}