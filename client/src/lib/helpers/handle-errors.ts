import { toast } from "sonner";

export const showErrorToast = (error: any) => {
  const message = error?.message || error?.response?.data?.message || error
  const finalMessage = Array.isArray(message) ? message[0] : message || "Đã có lỗi xảy ra";

  toast.error(finalMessage, {
    id: 'swr-infinite-error'
  });
}

export const getErrPayload = (error: any) => {
  return {
    success: false,
    message: error?.message || error?.response?.data?.message || error,
    statusCode: error?.status || 500,
    data: null,
  }
}