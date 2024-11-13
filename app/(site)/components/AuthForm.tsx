'use client';

import Button from "@/app/components/Button";
import { Input } from "@/app/components/Input/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {BsGithub, BsGoogle} from 'react-icons/bs'
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import toast from "react-hot-toast";
import {signIn, useSession} from 'next-auth/react'
import { useRouter } from "next/navigation";

type Varient = 'LOGIN' | 'REGISTER';
const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [varient,setVarient] = useState<Varient>("LOGIN");
    const [isLoading,setIsLoading] = useState<boolean>(false);
    
    // check session status is authenticated or not
    useEffect(() => {
      if(session?.status === 'authenticated'){
        router.push('/users');
      }
    },[session?.status,router])



    const toggoleVarient = useCallback(() => {
      if(varient === "LOGIN"){
        setVarient("REGISTER")
      }else{
        setVarient("LOGIN")
      } 
    },[varient]);

    const {register,handleSubmit,formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            name:'',
            email:'',
            password:''
        }
    });

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true);
      if(varient == "REGISTER"){
        // Axios Register
        const res = axios.post('/api/register',data).then(()=>signIn('credentials',data)).catch(err => toast(err.message)).finally(() => setIsLoading(false));
  
      }
      if(varient == "LOGIN"){
        // Axios Login
        try {
          signIn('credentials', {
            ...data,
            redirect: false
          }).then((callback) => {
            if (callback?.error) {
              toast.error("Invalid Credentials")
            }
            if (callback?.ok && !callback?.error) {
              toast.success("Logged In")
              router.push('/users');
            }
          }).finally(() => setIsLoading(false))
        } catch (error) {
          console.log(error);
        }
      }
    }

    const socialAction=(action:string) => {
      setIsLoading(true);
      // NextAuth Social Sign In
      signIn(action,{
        redirect:false
      }).then(callback =>{
        if(callback?.error){
          toast.error('Invalid credentials')
        }
        if(callback?.ok && !callback?.error){
          toast.success("Logged In");
        }
      })
    }
    return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {varient === "REGISTER" && (
              <Input label="Name" disabled={isLoading} register={register} id="name" type="text" errors={errors} />
          )}
            <Input label="Email address" disabled={isLoading} type="email" register={register} id="email" errors={errors} />
            <Input label="Password" disabled={isLoading} register={register} id="password" type="password" errors={errors} />
            <Button disabled={isLoading} type="submit" fullWidth>
              {varient === "LOGIN" ? "Sign in" : "Register"}
            </Button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"/>

            </div>
            <div className="relative flex justify-center text-sm"> 
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
            <div className="mt-6 flex gap-2">
              <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')}/>
              <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
            </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500"> 
          <div>
            {varient ==="LOGIN"?"New to BlipX?":"Already have an account?"}
          </div>
          <div onClick={toggoleVarient} className="underline cursor-pointer">
            {varient ==="LOGIN"?"Create an account":"Login"}  
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm