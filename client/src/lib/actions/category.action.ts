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
