"use server"
import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"
import { IConversation, IGetMessagesResponse, SearchUserResponse } from "@/types"

export const getUserById = async (userId: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<SearchUserResponse>>({
      url: `/users/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const getConversations = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<IConversation[]>>({
      url: "/chats/conversations",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const createConversation = async (recipientId: string, postId?: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<IConversation>>({
      url: "/chats",
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: {
        participants: [session.user.id, recipientId],
        postId,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const getMessages = async (conversationId: string, limit = 50, cursor?: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

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

    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const searchUsers = async (query: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<SearchUserResponse[]>>({
      method: "GET",
      url: `/chats/search?query=${encodeURIComponent(query)}`,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const deleteConversationForMe = async (conversationId: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/chats/conversation/${conversationId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const getUnreadCounts = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<number>>({
      url: "/chats/unread-count",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}
