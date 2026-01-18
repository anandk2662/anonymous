"use client";
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from "sonner"
import * as z from "zod"
import {  useForm } from "react-hook-form";
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
    Form,
} from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
const page = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast("success", {
                description: response.data.message
            })
            router.replace(`/signin`)
        } catch (error) {
            console.error("Error in signup of user ", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast("signUp failed", {
                description: axiosError.response?.data.message
            })
        }
    }
    return (
        <div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify Your Account
                        </h1>
                        <p className="mb-4">
                            Enter the verification code sent to your email
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={() => (
                                <FormItem className='text-center items-center justify-center'>
                                    <FormLabel className='pl-17 py-2'>Verification Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} className='my-2 py-2'>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default page
