import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";

export async function Post(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User=session?.user as User
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"not Authenticated"
        },{status:401}
    )
    }
    const userId=user._id
    const {acceptMessages}=await request.json()
    try {
        const updatedUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true})
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept message",

            },{status:401})
        }
        return Response.json({
                success:true,
                message:"message acceptance status updated",

            },{status:200})
        
    } catch (error) {
        console.log("error failed to update user status to accept messages")
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:500})
    }
}

export async function GET(request:Request){
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        const user:User=session?.user as User
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"not Authenticated"
            },{status:401}
        )
        }
        const userId=user._id
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }
        return Response.json({
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage
        })
    } catch (error) {
        console.log("error getting message acceptance status")
        return Response.json({
            success:false,
            message:"error getting message acceptance status"
        },{status:500})
    }
}