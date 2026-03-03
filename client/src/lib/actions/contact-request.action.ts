"use server"

import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"
import { IContactRequest } from "@/types"

export const submitContactRequest = async (postId: string, answer: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<any>>({
      url: `/contacts/${postId}`,
      method: "POST",
      headers: { Authorization: `Bearer ${session.user.access_token}` },
      body: { answer },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const getMyContactRequests = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<IContactRequest[]>>({
      url: "/contacts/requests",
      method: "GET",
      headers: { Authorization: `Bearer ${session.user.access_token}` },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const updateContactRequestStatus = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<any>>({
      url: `/contacts/${requestId}`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.user.access_token}` },
      body: { status },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}
