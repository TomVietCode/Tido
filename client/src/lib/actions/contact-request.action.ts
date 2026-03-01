"use server"

import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { IContactRequest } from "@/types"

export const submitContactRequest = async (postId: string, answer: string) => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

  const res = await sendRequest<IBackendRes<any>>({
    url: `/contacts/${postId}`,
    method: "POST",
    headers: { Authorization: `Bearer ${session.user.access_token}` },
    body: { answer },
  })

  return { success: true, data: res.data }
}

export const getMyContactRequests = async () => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

  const res = await sendRequest<IBackendRes<IContactRequest[]>>({
    url: "/contacts/requests",
    method: "GET",
    headers: { Authorization: `Bearer ${session.user.access_token}` },
  })

  return { success: true, data: res.data }
}

export const updateContactRequestStatus = async (
  requestId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

  const res = await sendRequest<IBackendRes<any>>({
    url: `/contacts/${requestId}`,
    method: "PATCH",
    headers: { Authorization: `Bearer ${session.user.access_token}` },
    body: { status },
  })

  return { success: true, data: res.data }
}