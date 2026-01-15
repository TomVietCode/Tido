"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"

export const getConversations = async () => {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const res = await sendRequest<IBackendRes<any>>({
    url: "/chats",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
  })

  if (res.success === false || !res.data) {
    return {
      success: false,
      message: res.message,
    }
  }

  return res
}