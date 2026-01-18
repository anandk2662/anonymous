"use client"
import {useForm} from "react-hook-form"
import * as z from "zod"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema=z.object({
    email:z.email("invalid email"),
    password:z.string().min(8,"min 8 chars")
})
type LoginForm=z.infer<typeof loginSchema>
const page = () => {

    const{
        register,
        handleSubmit,
        watch,
        formState:{errors,isSubmitting}
    }=useForm<LoginForm>({
        resolver:zodResolver(loginSchema),
    });
    async function onSubmit(data:LoginForm){
        
        await new Promise((resolve)=>setTimeout(resolve,5000));
        console.log("submitting the form",data)
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} >
        <div>
            <label htmlFor="email">email</label>
            <input className="border" type="text" id="email" {...register('email')}/>
            {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
            <label htmlFor="password">password</label>
            <input className="border" type="password" id="password" {...register('password')}/>
             {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} >{isSubmitting?"submitting":"submit"}</button>
    </form>
  )
}

export default page
