import { HttpError } from "@/lib/helpers/api"

export const ErrUnauthorized = new HttpError("Bạn cần đăng nhập để thực hiện hành động này!", 401)
export const ErrInternalServerError = new HttpError("Đã xảy ra lỗi kết nối với máy chủ", 500)
export const ErrDataNotFound = new HttpError("Không tìm thấy dữ liệu", 404)
export const ErrDataInvalid = new HttpError("Dữ liệu không hợp lệ", 400)