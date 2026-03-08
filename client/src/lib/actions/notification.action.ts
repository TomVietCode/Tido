"use server"

import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"
import { INotification } from "@/types"

export const getNotifications = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<INotification[]>>({
      url: "/notifications",
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

export const getNotificationUnreadCount = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<number>>({
      url: "/notifications/unread-count",
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

export const markNotificationAsRead = async (id: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<any>>({
      url: `/notifications/${id}/read`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<any>>({
      url: "/notifications/read-all",
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })
    return res
  } catch (error: any) {
    return getErrPayload(error)
  }
}
