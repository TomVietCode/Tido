"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"
import { Conversation } from "@/types"

export const getConversations = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<Conversation[]>>({
      url: "/chats/conversations",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return {
      success: true,
      data: res.data,
      message: res.message,
      statusCode: res.statusCode
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      code: error.status || 500
    }
  }
}

export const getMessages = async (conversationId: string, limit = 50, skip = 0) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<any>>({
      url: `/chats/conversation/${conversationId}/messages`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      queryParams: {
        limit, 
        skip
      }
    })

    return {
      success: true,
      data: res.data,
      message: res.message,
      statusCode: res.statusCode
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      statusCode: error.status || 500
    }
  }
}