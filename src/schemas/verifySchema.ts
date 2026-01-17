import * as z from "zod";

export const verifySchema=z.object({
    identifier:z.string().length(6,"Verification code must be 6 digits")
})