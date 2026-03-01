import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { submitContactRequest } from "@/lib/actions/contact-request.action"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  question: string
}

export default function QuestionDialog({
  open,
  onOpenChange,
  postId,
  question,
}: QuestionDialogProps) {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitContactRequest(postId, answer)
      toast.success("Đã gửi câu trả lời, vui lòng chờ chủ bài đăng phản hồi.")
      setAnswer("")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message ?? "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Câu hỏi xác minh</DialogTitle>
          <DialogDescription>
            Chủ bài đăng yêu cầu bạn trả lời câu hỏi sau để xác minh.
          </DialogDescription>
        </DialogHeader>
        <p className="text-lg font-medium">{question}</p>
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Nhập câu trả lời của bạn..."
        />
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Gửi câu trả lời"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}


