import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    await dbConnect()
    try {
        const {username,email,password}=await request.json()
        const existingUserVerifiedByUsername=await UserModel.findOne({username,isVerified:true})
        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"Username already taken",
            },{status:400})
        }
        const exisitingUserByEmail=await UserModel.findOne({
            email,isVerified:true
        })
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        if(exisitingUserByEmail){
            if (exisitingUserByEmail.isVerified){
                return NextResponse.json({
                    success:false,
                    message:"user already exists"
                },{status:500})
            }else{
                const hashedPassword=await bcrypt.hash(password,10)
                exisitingUserByEmail.password=hashedPassword;
                exisitingUserByEmail.verifyCode=verifyCode;
                exisitingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await exisitingUserByEmail.save()
            }
        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser=new UserModel({
                username,
                    email,
                    password:hashedPassword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessage:true,
                    messages:[]
            })
            await newUser.save()
        }
        //send verification email
        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
                success:true,
                message:"User registered successfully please verify your email"
            },{status:201})
    } catch (error) {
        console.error("Error registering user",error)
        return NextResponse.json({
            success:false,
            message:"Error registering user"
        },{status:500})
    }
}