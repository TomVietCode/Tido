import { AdminUserListItem } from "@/types"
import { sendRequest } from "../helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"

const errPayload = (err: unknown) => getErrPayload(err) as any

export const getAdminUsers = async (
  params: { page?: number; limit?: number },
  token: string
): Promise<IBackendRes<IModelPaginate<AdminUserListItem>>> => {
  try {
    const res = await sendRequest<IBackendRes<IModelPaginate<AdminUserListItem>>>({
      url: "/users/admin/list",
      method: "GET",
      queryParams: params,
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const adminToggleBanUser = async (
  id: string,
  token: string
): Promise<IBackendRes<AdminUserListItem>> => {
  try {
    const res = await sendRequest<IBackendRes<AdminUserListItem>>({
      url: `/users/admin/${id}/toggle-ban`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const adminToggleRoleUser = async (
  id: string,
  token: string
): Promise<IBackendRes<AdminUserListItem>> => {
  try {
    const res = await sendRequest<IBackendRes<AdminUserListItem>>({
      url: `/users/admin/${id}/toggle-role`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const adminDeleteUser = async (
  id: string,
  token: string
): Promise<IBackendRes<boolean>> => {
  try {
    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/users/admin/${id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}
