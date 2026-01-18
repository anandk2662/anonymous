import { UserModel } from "@/models/User";
import { User } from "@/models/User";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { success } from "zod";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageId=params.messageid
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:Partial<User> =session?.user as Partial<User>

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"not authenticated"
            },{status:401}
        )
    }
    try {
        const updatedResult=await UserModel.updateOne({_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(updatedResult.modifiedCount==0){
            return Response.json(
                {
                    success:false,
                    message:"message not found or already deleted"
                },
                {status:404}
            )
        }
        return Response.json(
            {succes:true,
                message:"Message deleted"
            },
            {status:200}
        )
    } catch (error) {
        console.log("error in deleting message",error)
        return Response.json({
            success:false,
            message:"error deleting message"
        },{status:500})
    }
}