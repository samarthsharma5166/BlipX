"use client"
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FieldValue, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../Modal'
import { Input } from '../Input/Input'
import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'
import Button from '../Button'

interface SettingModalProps {
    isOpen: boolean,
    currentUser?: User,
    onClose: () => void
}

const SettingModal: React.FC<SettingModalProps> = ({
    isOpen,
    currentUser,
    onClose
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name || '',
            image: currentUser?.image,
            email: currentUser?.email
        }
    });

    const image = watch('image');
    const handleUpload = (results: any) => {
        console.log("image",results);
        setValue('image', results?.info?.secure_url, { shouldValidate: true })
    }
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
            axios.post('/api/settings', data).then(() => {
            router.refresh();
            onClose();
        })
            .catch(err => {
                console.log("error frm the settigs",err)
                toast.error('Something went wrong')})
            .finally(() => setIsLoading(false));
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className='border-b border-gray-900/10 pb-12'>
                        <h2 className='
                        text-base
                        font-semibold
                        leading-7
                        text-gray-900
                    '>
                            Profile
                        </h2>
                        <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Edit your public informartion
                        </p>
                        <div
                            className='
                      mt-10
                      flex
                      flex-col
                      gap-y-8
                     '
                        >
                            <Input disabled={isLoading} errors={errors} required label="Name" id="name" register={register} type="text" />
                            <div>
                                <label className='block text-sm font-medium leading-6 text-gray-900'>
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3 ">
                                    <Image width={"48"} height={"48"} className="rounded-full" src={image || currentUser?.image || '/account.png'} alt={"avatar"} />
                                    <CldUploadButton
                                        options={{
                                            maxFiles: 1
                                        }}
                                        onSuccess={handleUpload}
                                        uploadPreset="uogp832q"
                                        onError={(error)=>console.log(error)}
                                    >

                                        <div
                                            className="
                                                flex
                                                justify-center
                                                rounded-md
                                                px-3
                                                py-2
                                                text-sm
                                                font-semibold
                                                focus-visible:outline
                                                focus-visible:outline-2
                                                focus-visible:outline-offset-2
                                                text-white
                                            bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600
                                            "
                                        >
                                            Change
                                        </div>

                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className='
                  mt-6
                  flex
                  items-center
                  justify-end
                  gap-x-6
                 '
                    >
                        <Button
                            disabled={isLoading}
                            secondary
                            onClick={onClose}
                            type='button'
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            type='submit'
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default SettingModal