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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">User Dashboard</h1>
          <p className="text-muted-foreground">Manage your anonymous messages and profile settings</p>
        </div>

        {/* Profile URL Card */}
        <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-card-foreground">Your Unique Link</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none"
            />
            <Button onClick={copyToClipboard} variant="default" className="sm:w-auto">
              Copy Link
            </Button>
          </div>
        </div>

        {/* Message Settings Card */}
        <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground mb-1">Message Settings</h2>
              <p className="text-sm text-muted-foreground">
                {acceptMessages ? 'You are currently accepting messages' : 'Messages are currently disabled'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleswitchChange}
                disabled={isSwitchLoading}
              />
              <span className="text-sm font-medium text-foreground">
                {acceptMessages ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Messages Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Your Messages</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Messages.length > 0 ? (
            Messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground text-lg">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">Share your link to start receiving messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
