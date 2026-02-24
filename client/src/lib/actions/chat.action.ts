"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"
import { IConversation, IGetMessagesResponse, SearchUserResponse } from "@/types"

export const getUserById = async (userId: string) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<SearchUserResponse>>({
      url: `/users/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return { success: true, data: res.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const getConversations = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<IConversation[]>>({
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
      statusCode: res.statusCode,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      code: error.status || 500,
    }
  }
}

export const createConversation = async (recipientId: string) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<IConversation>>({
      url: "/chats",
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: {
        participants: [session.user.id, recipientId],
      },
    })
    return { success: true, data: res.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const getMessages = async (conversationId: string, limit = 50, cursor?: string) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<IGetMessagesResponse>>({
      url: `/chats/conversation/${conversationId}/messages`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      queryParams: {
        limit,
        cursor,
      },
    })

    return {
      success: true,
      data: res.data,
      message: res.message,
      statusCode: res.statusCode,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      statusCode: error.status || 500,
    }
  }
}

export const searchUsers = async (query: string) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<SearchUserResponse[]>>({
      method: "GET",
      url: `/chats/search?query=${encodeURIComponent(query)}`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      data: [],
    }
  }
}

export const deleteConversationForMe = async (conversationId: string) => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/chats/conversation/${conversationId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return { success: true, data: res.data }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const getUnreadCounts = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<number>>({
      url: "/chats/unread-count",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return {
      success: true,
      data: res.data || 0,
      message: res.message,
      statusCode: res.statusCode,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      statusCode: error.status || 500,
    }
  }
}