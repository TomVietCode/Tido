import { AdminPostListItem, PostDetail } from "@/types"
import { sendRequest } from "../helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"

const errPayload = (err: unknown) => getErrPayload(err) as any

export const getAdminPosts = async (
  params: {
    page?: number
    limit?: number
    search?: string
    catId?: number
    status?: string
    type?: string
  },
  token: string
): Promise<IBackendRes<IModelPaginate<AdminPostListItem>>> => {
  try {
    const res = await sendRequest<IBackendRes<IModelPaginate<AdminPostListItem>>>({
      url: "/posts/admin/list",
      method: "GET",
      queryParams: params,
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const getAdminPostDetail = async (
  id: string,
  token: string
): Promise<IBackendRes<PostDetail>> => {
  try {
    const res = await sendRequest<IBackendRes<PostDetail>>({
      url: `/posts/admin/${id}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const adminToggleHidePost = async (
  id: string,
  token: string
): Promise<IBackendRes<PostDetail>> => {
  try {
    const res = await sendRequest<IBackendRes<PostDetail>>({
      url: `/posts/admin/${id}/toggle-hide`,
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}

export const adminDeletePost = async (
  id: string,
  token: string
): Promise<IBackendRes<boolean>> => {
  try {
    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/posts/admin/${id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err) {
    return errPayload(err)
  }
}
