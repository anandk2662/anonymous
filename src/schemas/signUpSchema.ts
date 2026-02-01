import * as z from "zod";

export const usernameValidation=z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"username must not be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")

export const SignUpSchema=z.object({
    username:usernameValidation,
    email:z.email({error:"Invalid email address"}),
    password:z.string().min(8,{error:"password must atleast 8 characters"})
})