"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"

export const getConversations = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const res = await sendRequest<IBackendRes<any>>({
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
      code: res.statusCode
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      code: error.status || 500
    }
  }
}