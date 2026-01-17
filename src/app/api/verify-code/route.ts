import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { verify } from "crypto";
import { verifySchema } from "@/schemas/verifySchema";

const verifyCodeQuerySchema = z.object({
    verifyCode: verifySchema
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const result = verifyCodeQuerySchema.safeParse(code)
        if (!result.success) {
            return Response.json({
                success: false,
                message: "invalid verification code"
            }, { status: 400 })
        } else {
            const decodedUsername = decodeURIComponent(username)
            const user = await UserModel.findOne({ username: decodedUsername })
            if (!user) {
                return Response.json(
                    {
                        success: false,
                        message: "user not found"
                    },
                    { status: 400 }
                )
            }
            const isCodeValid = user.verifyCode === code
            const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
            if (isCodeValid && isCodeNotExpired) {
                user.isVerified = true
                await user.save()
                return Response.json(
                    {
                        success: true,
                        message: "Account Verified successfully"
                    },
                    { status: 200 }
                )
            } else if (!isCodeNotExpired) {
                return Response.json(
                    {
                        success: false,
                        message: "verification code has expired , please signup again to get a new code"
                    },
                    { status: 400 }
                )

            }else{
                return Response.json(
                    {
                        success: false,
                        message: "incorrect verification code"
                    },
                    { status: 400 }
                )
            }
        }
    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            { status: 500 }
        )
    }
}