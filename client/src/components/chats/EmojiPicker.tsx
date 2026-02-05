import { EmojiStyle, SuggestionMode } from "emoji-picker-react"
import dynamic from "next/dynamic"

const Picker = dynamic(() => import("emoji-picker-react"), {
  loading: () => <div className="w-80 h-96 bg-white animate-pulse rounded-lg" />,
  ssr: false,
})

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="relative">
      {/* Backdrop để đóng picker */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="relative z-50">
        <Picker 
          onEmojiClick={(emojiObject) => onSelect(emojiObject.emoji)} 
          lazyLoadEmojis={true}
          suggestedEmojisMode={SuggestionMode.RECENT}
          emojiStyle={EmojiStyle.FACEBOOK}
          skinTonesDisabled={true}
          previewConfig={{ showPreview: false }}
        />
      </div>
    </div>
  )
}
