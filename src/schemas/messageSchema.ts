import * as z from "zod";

export const messageSchema=z.object({
    content:z
    .string()
    .min(10,{error:"message must be at least of 10 characters"})
    .max(300,{error:"content must be no longer than 300 characters"})
})