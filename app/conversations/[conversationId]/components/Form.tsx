"use client"
import useConversation from "@/app/hooks/useConversation"
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from 'next-cloudinary'
const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ""
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post(`/api/messages`, {
      ...data,
      conversationId
    })
  }

  const handleUpload = (results: any) => {
    console.log("result from form.tsx",results);
    axios.post(`/api/messages`, { 
      image: results?.info?.secure_url,
      conversationId
    })
  }
  return (
    <div className="px-4 py-6 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        // onUpload={(results)=>handleUpload(results)}
        onSuccess={handleUpload}
        uploadPreset="uogp832q"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
      flex 
      items-center
      gap-2
      lg:gap-4
      w-full
      "
      >
        <MessageInput id="message" register={register} errors={errors} required placeholder="Write a message" />
        <button type="submit"
          className="
          rounded-full
          p-2
          bg-sky-600
          cursor-pointer
          hover:bg-sky-500
          transition
         ">
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  )
}

export default Form