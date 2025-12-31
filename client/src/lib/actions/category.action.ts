import { Category } from "@/types"
import { sendRequest } from "../helpers/api"

export const getCategoryAction = async (): Promise<IBackendRes<Category[]>> => {
  try {
    const res = await sendRequest<IBackendRes<Category[]>>({
      url: "/categories",
      method: "GET"
    });

    if (res.statusCode === 200 && res.data) {
      return { success: true, data: res.data, statusCode: res.statusCode };
    }

    return { 
      success: false, 
      message: res.message || "Không thể lấy danh sách danh mục",
      statusCode: res.statusCode 
    };
  } catch (err) {
    return { 
      success: false, 
      statusCode: 500,
      message: "Đã xảy ra lỗi kết nối với máy chủ" 
    };
  }
};