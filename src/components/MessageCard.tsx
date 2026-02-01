"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/models/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
  try {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    )

    toast.success(response.data.message)
    onMessageDelete(message._id.toString())
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to delete message"
    )
    console.error("Delete error:", error)
  }
}

    return (
       <Card className="border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
  <CardHeader className="flex justify-between items-start px-4 py-3 bg-gray-50">
    <div>
      <CardTitle className="text-lg font-semibold text-gray-800">
        Anonymous Message
      </CardTitle>
      <CardDescription className="text-sm text-gray-500 mt-1">
        {new Date(message.createdAt).toLocaleString()}
      </CardDescription>
    </div>

    {/* Delete Button */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="p-2 rounded-full hover:bg-red-100 transition-colors"
        >
          <X className="w-4 h-4 text-black" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 mt-2">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>

  <CardContent className="px-4 py-3 bg-white text-gray-800">
    <p className="text-sm leading-relaxed">{message.content}</p>
  </CardContent>
</Card>

    )
}

export default MessageCard
