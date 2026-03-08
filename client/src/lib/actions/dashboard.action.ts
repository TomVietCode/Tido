import { sendRequest } from "../helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"

export interface DashboardData {
  stats: {
    newPostsToday: { value: number; trend: number }
    foundThisMonth: { value: number; trend: number }
    totalUsers: { value: number; trend: number }
  }
  activityChart: { day: string; lost: number; found: number }[]
  categoryRatio: {
    total: number
    items: { name: string; value: number; percentage: number }[]
  }
  recentActivities: {
    id: string
    action: string
    time: string
    status: string
    user: string
  }[]
}

export const getDashboardData = async (
  token: string
): Promise<IBackendRes<DashboardData | null>> => {
  try {
    const res = await sendRequest<IBackendRes<DashboardData>>({
      url: "/dashboard",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (err: any) {
    return getErrPayload(err)
  }
}
