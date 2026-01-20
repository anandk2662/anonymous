import { UserModel, User } from "@/models/User"
import dbConnect from "@/lib/dbConnect"
import { authOptions } from "../../auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await params // ✅ FIX

  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    )
  }

  const user = session.user as Partial<User>

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
    )

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting message",
      },
      { status: 500 }
    )
  }
}
