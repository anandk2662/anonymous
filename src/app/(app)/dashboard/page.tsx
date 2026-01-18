"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState,useEffect, use, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useClickAnyWhere } from "usehooks-ts";
const DashboardPage = () => {
  const [Messages,setMessages]=useState<Message[]>([])
  const [isLoading,setIsLoading]=useState(false)
  const[isSwitchLoading,setIsSwitchLoading]=useState(false)
   // use imported Message type from "@/models/User"
  const handleDeleteMessage=(messageId:string)=>{
      setMessages(Messages.filter((message)=>message._id.toString()!==messageId))
    }

    const {data:session}=useSession()
    const form=useForm({
      resolver:zodResolver(acceptMessageSchema)
    })
    const {register,watch,setValue}=form;
    const acceptMessages=watch("acceptMessages")
    const fetchAcceptMessage=useCallback(async () =>{
      setIsSwitchLoading(true)
      try {
        const response=await axios.get<ApiResponse>('/api/accept-messages')
        setValue('acceptMessages',response.data.isAcceptingMessage!)
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast("error",{description:axiosError.response?.data.message || "Failed to fetch message settings"})
      }finally{
        setIsSwitchLoading(false)
      }
    },[setValue,toast])

    const fetchMessages= useCallback(async(refresh:boolean=false)=>{
      setIsLoading(true)
      setIsSwitchLoading(true)
      try {
        const response=await axios.get<ApiResponse>("/api/get-messages")
        setMessages(response.data.messages || [])
        if(refresh){
          toast("refreshed messages",{description:"showing latest messages"})
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast("error",{description:axiosError.response?.data.message || "Failed to fetch message settings"})
      }finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
    },[setIsLoading,setMessages,toast])

    useEffect(()=>{
      if(!session || !session.user) return 
      fetchMessages()
      fetchAcceptMessage()
    },[session,toast,setValue,fetchAcceptMessage,fetchMessages])

    const handleswitchChange=async()=>{
      try {
        const response=await axios.post<ApiResponse>('/api/accept-messages',{acceptMessages:!acceptMessages})
        setValue('acceptMessages',!acceptMessages)
        toast(response.data.message)
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast("error",{description:axiosError.response?.data.message || "Failed to fetch message settings"})
      }
    }
    if(!session || !session.user){
      return <div>Please Login</div>
    }

    const{username}=session.user as User
    const baseUrl=`${window.location.protocol}//${window.location.host}`
    const profileUrl=`${baseUrl}/u/${username}`

    const copyToClipboard=()=>{
      navigator.clipboard.writeText(profileUrl)
      toast("URL copied",{description:"profile url has been copied to clipboard"})
    }
    
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleswitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Messages.length > 0 ? (
          Messages.map((message, index) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
