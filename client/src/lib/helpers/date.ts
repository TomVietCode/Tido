import dayjs from "dayjs"
import "dayjs/locale/vi"
import relativeTime from "dayjs/plugin/relativeTime"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.locale("vi")

export function getChatTimeAgo(dateInput: string | Date) {
  const date = dayjs(dateInput)
  const now = dayjs()

  // below 1 min
  const diffInSeconds = now.diff(date, "second")
  if (diffInSeconds < 60) return "Vừa xong"

  // in the same day
  if (date.isToday()) {
    const diffInMinutes = now.diff(date, "minute")
    if (diffInMinutes < 60) {
      return date.fromNow()
    }
    return date.format("HH:mm")
  }

  // yesterday
  if (date.isYesterday()) {
    return `Hôm qua lúc ${date.format("HH:mm")}`
  }

  // in the last 7 days
  const diffInDays = now.diff(date, "day")
  if (diffInDays < 7) {
    return date.format("dddd [lúc] HH:mm")
  }

  // in the same year
  if (date.isSame(now, "year")) {
    return date.format("D [thg] M [lúc] HH:mm")
  }

  // different year
  return date.format("D [thg] M, YYYY")
}
