import bcrypt from 'bcrypt'
import prismadb from '@/app/libs/prismaDb'
import { NextResponse } from 'next/server'
import Error from 'next/error'

export async function POST(req: Request,res: Response) {
    try {
        const body = await req.json()
        console.log(body)
        const { email, name, password } = body  

        if(!email || !name || !password){
            return new NextResponse('Missing info', {status:400})
        }

        const emailExists = await prismadb.user.findUnique({
            where: {
                email
            }
        })

            // if(emailExists){
            //      return res.json({
            //         message:"Email already exists",
            //         status:404
            //      })
            // }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        })

        return NextResponse.json(user)

    } catch (error:any) {
        console.log(error)
        return new NextResponse('Internal Error', {status:500})
    }
}