"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Label } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Newspaper,
  SearchCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/vi"
import { getDashboardData, type DashboardData } from "@/lib/actions/dashboard.action"

dayjs.extend(relativeTime)
dayjs.locale("vi")

const CATEGORY_COLORS = [
  "hsl(263, 70%, 50%)",
  "hsl(160 60% 45%)",
  "hsl(215, 16%, 47%)",
  "hsl(280 65% 60%)",
  "hsl(340 75% 55%)",
  "hsl(120 60% 45%)",
  "hsl(217, 91%, 60%)",
  "hsl(50, 100%, 48%)"
]

const activityChartConfig = {
  lost: { label: "Tin thất lạc", color: "oklch(75% 0.183 55.934)" },
  found: { label: "Tin tìm thấy", color: "oklch(0.623 0.214 259.815)" },
} satisfies ChartConfig

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  CLOSED: {
    label: "Hoàn thành",
    className: "bg-gray-100 text-gray-700",
  },
  OPEN: {
    label: "Đang mở",
    className: "bg-green-100 text-green-700",
  },
  HIDDEN: {
    label: "Đã ẩn",
    className: "bg-red-100 text-red-700",
  },
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!session?.user?.access_token) return
    setLoading(true)
    const res = await getDashboardData(session.user.access_token)
    if (res.data) setData(res.data)
    setLoading(false)
  }, [session?.user?.access_token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const categoryChartConfig = useMemo<ChartConfig>(() => {
    if (!data) return {}
    const config: ChartConfig = {}
    data.categoryRatio.items.forEach((item, i) => {
      config[`cat${i}`] = {
        label: item.name,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }
    })
    return config
  }, [data])

  const categoryChartData = useMemo(() => {
    if (!data) return []
    return data.categoryRatio.items.map((item, i) => ({
      name: `cat${i}`,
      displayName: item.name,
      value: item.value,
      percentage: item.percentage,
      fill: `var(--color-cat${i})`,
    }))
  }, [data])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="p-6 space-y-6">
      {/* ─── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Tin mới hôm nay"
          value={data?.stats.newPostsToday.value ?? 0}
          trend={data?.stats.newPostsToday.trend ?? 0}
          trendLabel="so với hôm qua"
          icon={Newspaper}
        />
        <StatCard
          title="Đã tìm được / trao trả (Tháng này)"
          value={data?.stats.foundThisMonth.value ?? 0}
          trend={data?.stats.foundThisMonth.trend ?? 0}
          trendLabel="so với tháng trước"
          icon={SearchCheck}
        />
        <StatCard
          title="Tổng người dùng"
          value={data?.stats.totalUsers.value ?? 0}
          trend={data?.stats.totalUsers.trend ?? 0}
          trendLabel="so với tháng trước"
          icon={Users}
        />
      </div>

      {/* ─── Charts ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hoạt động 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityChartConfig} className="h-[250px] w-full">
              <BarChart data={data?.activityChart ?? []} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="lost" fill="var(--color-lost)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="found" fill="var(--color-found)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tỷ lệ bài đăng theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ChartContainer
                config={categoryChartConfig}
                className="aspect-square max-h-[220px] flex-1"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                  />
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={85}
                    strokeWidth={4}
                    stroke="hsl(var(--background))"
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {data?.categoryRatio.total ?? 0}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-sm"
                              >
                                Bài đăng
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="flex flex-col gap-3 shrink-0">
                {data?.categoryRatio.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                    />
                    <span className="text-muted-foreground whitespace-nowrap">
                      {item.name} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Recent Activities ───────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bài đăng</TableHead>
                <TableHead>Thời gian đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Chưa có hoạt động nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.recentActivities.map((activity) => {
                  const status = STATUS_MAP[activity.status] ?? STATUS_MAP.OPEN
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium max-w-[400px] truncate">
                        {activity.action}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dayjs(activity.time).fromNow()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
}: {
  title: string
  value: number
  trend: number
  trendLabel: string
  icon: LucideIcon
}) {
  const isPositive = trend >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString("vi-VN")}</div>
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? "+" : ""}
          {trend}% {trendLabel}
        </p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-40 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[220px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
