import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";

export async function GET(request:Request){
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
    try {
        const user=await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'messages'}}}
        ])
        console.log(user)
        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:401}
        )
        
        }
        return Response.json({
                success:true,
                messages:user[0].messages
            },{status:200}
        )
    }catch(error){
        console.log("unexpected error occured",error)
        return Response.json({
                success:false,
                message:"could not get messages"
            },{status:500}
        )
    }
}