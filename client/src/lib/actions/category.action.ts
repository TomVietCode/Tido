import { Category } from "@/types"
import { sendRequest } from "../helpers/api"

export const getCategoryAction = async () => {
  const res = await sendRequest<IBackendRes<Category[]>>({
    url: "/categories",
    method: "GET"
  })
  if (res.statusCode === 200 && res.data) {
    return res.data
  } else {
    throw new Error(res.message)
  }
}
