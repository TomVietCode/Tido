import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { PostStatus, PostType } from '@common/enums'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    )
    const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const startOfWeek = new Date(
      sevenDaysAgo.getFullYear(),
      sevenDaysAgo.getMonth(),
      sevenDaysAgo.getDate(),
    )

    const [
      newPostsToday,
      newPostsYesterday,
      foundThisMonth,
      foundLastMonth,
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      weekPosts,
      categoryGroups,
      recentPosts,
    ] = await Promise.all([
      this.prisma.post.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.post.count({
        where: { createdAt: { gte: startOfYesterday, lt: startOfToday } },
      }),
      this.prisma.post.count({
        where: { status: PostStatus.CLOSED, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.post.count({
        where: {
          status: PostStatus.CLOSED,
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
      this.prisma.post.findMany({
        where: { createdAt: { gte: startOfWeek } },
        select: { type: true, createdAt: true },
      }),
      this.prisma.post.groupBy({
        by: ['categoryId'],
        _count: { _all: true },
      }),
      this.prisma.post.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true,
          user: { select: { fullName: true } },
        },
      }),
    ])

    const activityChart = this.buildActivityChart(weekPosts, now)
    const categoryRatio = await this.buildCategoryRatio(categoryGroups)

    return {
      stats: {
        newPostsToday: {
          value: newPostsToday,
          trend: this.calcTrend(newPostsToday, newPostsYesterday),
        },
        foundThisMonth: {
          value: foundThisMonth,
          trend: this.calcTrend(foundThisMonth, foundLastMonth),
        },
        totalUsers: {
          value: totalUsers,
          trend: this.calcTrend(newUsersThisMonth, newUsersLastMonth),
        },
      },
      activityChart,
      categoryRatio,
      recentActivities: recentPosts.map((p) => ({
        id: p.id,
        action: `${p.type === 'LOST' ? 'Tin thất lạc' : 'Tin tìm được'}: '${p.title}'`,
        time: p.createdAt,
        status: p.status,
        user: p.user.fullName,
      })),
    }
  }

  private calcTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  private buildActivityChart(
    posts: { type: string; createdAt: Date }[],
    now: Date,
  ) {
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const result: { day: string; lost: number; found: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      )
      const end = new Date(start.getTime() + 86_400_000)

      const dayPosts = posts.filter(
        (p) => p.createdAt >= start && p.createdAt < end,
      )

      result.push({
        day: dayLabels[start.getDay()],
        lost: dayPosts.filter((p) => p.type === 'LOST').length,
        found: dayPosts.filter((p) => p.type === 'FOUND').length,
      })
    }

    return result
  }

  private async buildCategoryRatio(
    groups: { categoryId: number; _count: { _all: number } }[],
  ) {
    if (groups.length === 0) return { total: 0, items: [] }

    const categoryIds = groups.map((g) => g.categoryId)
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    })
    const nameMap = new Map(categories.map((c) => [c.id, c.name]))
    const total = groups.reduce((sum, g) => sum + g._count._all, 0)

    const items = groups
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => ({
        name: nameMap.get(g.categoryId) || 'Khác',
        value: g._count._all,
        percentage: total > 0 ? Math.round((g._count._all / total) * 100) : 0,
      }))

    return { total, items }
  }
}
