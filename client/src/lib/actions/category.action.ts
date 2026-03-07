import { Category } from "@/types"
import { sendRequest } from "../helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"

export const getCategoryAction = async (): Promise<IBackendRes<Category[] | null>> => {
  try {
    const res = await sendRequest<IBackendRes<Category[]>>({
      url: "/categories",
      method: "GET",
    })

    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}

export const getCategoriesPaginated = async (params: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<IBackendRes<IModelPaginate<Category> | null>> => {
  try {
    const res = await sendRequest<IBackendRes<IModelPaginate<Category>>>({
      url: "/categories/paginated",
      method: "GET",
      queryParams: params,
    })
    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}

export const createCategory = async (
  data: { name: string; status?: string; iconCode?: string },
  token: string
): Promise<IBackendRes<Category | null>> => {
  try {
    const res = await sendRequest<IBackendRes<Category>>({
      url: "/categories",
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}

export const updateCategory = async (
  id: number,
  data: { name?: string; status?: string; iconCode?: string },
  token: string
): Promise<IBackendRes<Category | null>> => {
  try {
    const res = await sendRequest<IBackendRes<Category>>({
      url: `/categories/${id}`,
      method: "PATCH",
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}

export const deleteCategory = async (
  id: number,
  token: string
): Promise<IBackendRes<Category | null>> => {
  try {
    const res = await sendRequest<IBackendRes<Category>>({
      url: `/categories/${id}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}
