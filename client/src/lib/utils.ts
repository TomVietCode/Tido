import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HAS_EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}|[0-9#*]\uFE0F?\u20E3/u

export const isOnlyEmoji = (text: string): boolean => {
  const t = text.trim()
  if (!t) return false

  if (!HAS_EMOJI.test(t)) return false

  const remaining = t
    .replace(/\p{Extended_Pictographic}(\p{Emoji_Modifier}|\uFE0F|\u200D)*/gu, '') 
    .replace(/\p{Regional_Indicator}{2}/gu, '')  
    .replace(/[0-9#*]\uFE0F?\u20E3/gu, '')     
    .replace(/[\uFE0F\u200D]/gu, '')        

  return remaining.length === 0
}