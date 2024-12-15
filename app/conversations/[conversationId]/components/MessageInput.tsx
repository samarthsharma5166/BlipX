'use client'
import React from "react"
import { Field, FieldValues, UseFormRegister } from "react-hook-form"

interface MessageInputProps{
    id:string,
    register:UseFormRegister<FieldValues>
    placeholder:string,
    type?:string,
    required?:boolean,
    errors:FieldValues
}
const MessageInput:React.FC<MessageInputProps> = ({
    placeholder,
    id,
    type,
    required,
    register,
    errors
}) => {
  return (
    <div className="relative w-full">
        <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id,{required})}
        placeholder={placeholder}
        className="
        text-black
        font-light
        px-3
        py-2
        w-full
        bg-neutral-100
        placeholder-gray-400
        focus:outline-none
        rounded-full
        "
        />

    </div>
  )
}

export default MessageInput