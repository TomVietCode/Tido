# TIDO – Nền tảng kết nối đồ thất lạc

## 1. Giới thiệu

TIDO là nền tảng hỗ trợ kết nối giữa người làm mất đồ và người nhặt được đồ, nhằm giải quyết bài toán thất lạc tài sản cá nhân một cách an toàn, minh bạch và hiệu quả.

Hệ thống tập trung vào việc:

- Đăng tải và quản lý thông tin mất đồ, nhặt được
- Giao tiếp trực tiếp giữa các bên bằng chat thời gian thực
- Theo dõi trạng thái trả đồ rõ ràng.
- Xác minh chủ sở hữu thông qua câu hỏi bảo mật
- Hỗ trợ tìm kiếm bằng AI
---

## 2. Phạm vi dự án

TIDO được xây dựng như một nền tảng web, app mobile hướng đến người dùng phổ thông, có thể truy cập trên cả máy tính và thiết bị di động.

Đối tượng sử dụng:

- Người làm mất đồ cá nhân
- Người nhặt được đồ và muốn tìm người trả lại
- Quản trị viên hệ thống

---

## 3. Phân quyền người dùng

### 3.1 Guest (Khách)

- Truy cập trang chủ
- Xem danh sách bài đăng
- Tìm kiếm và lọc cơ bản

### 3.2 Authenticated User (Người dùng đã đăng nhập)

- Đăng tin mất đồ hoặc nhặt được đồ
- Xem đầy đủ thông tin bài đăng
- Liên hệ và chat với người đăng bài
- Xác nhận quá trình nhận hoặc trả đồ

### 3.3 Admin (Quản trị viên)

- Quản lý người dùng
- Kiểm duyệt và xóa bài đăng vi phạm
- Quản lý danh mục hệ thống

---

## 4. Tính năng cốt lõi

### 4.1 Xác thực người dùng (Authentication)

- Đăng ký và đăng nhập bằng Email/Password/Google
---

### 4.2 Quản lý bài đăng (Post Management)

Hệ thống hỗ trợ hai loại bài đăng:

- Bài đăng mất đồ (Lost)
- Bài đăng nhặt được đồ (Found)

#### Thông tin bài đăng bao gồm:

- Tiêu đề bài đăng
- Loại bài đăng (Mất đồ / Nhặt được)
- Trạng thái bài đăng (Đang tìm, Đã tìm được, Đã hoàn thành)
- Danh mục:
  - Ví
  - Giấy tờ
  - Điện thoại
  - Laptop
  - Chìa khóa
  - Khác
- Hình ảnh (cho phép upload nhiều ảnh)
- Thời gian và địa điểm (nhập dạng văn bản)
- Mô tả chi tiết
- Thông tin hậu tạ (đối với bài đăng mất đồ)
- Câu hỏi bảo mật để xác minh chủ sở hữu

#### Hiển thị bài đăng:

- Danh sách bài đăng: ảnh đại diện, tiêu đề, khu vực, thời gian
- Trang chi tiết bài đăng: hiển thị đầy đủ thông tin và các hành động liên quan

---

### 4.3 Tìm kiếm và bộ lọc

- Tìm kiếm theo từ khóa trong tiêu đề và mô tả
- Bộ lọc theo:
  - Loại bài đăng (Mất đồ / Nhặt được)
  - Danh mục
  - Thời gian đăng (mới nhất / cũ nhất)
- Hỗ trợ mở rộng tìm kiếm theo hình ảnh trong các phiên bản nâng cao

---

### 4.4 Tương tác và kết nối

#### Chat thời gian thực

- Chat 1-1 giữa người đăng bài và người liên hệ
- Gửi tin nhắn văn bản và hình ảnh

#### Quy trình nhận và trả đồ

1. Người mất đồ gửi yêu cầu nhận lại đồ từ bài đăng nhặt được
2. Hai bên liên hệ và xác minh thông tin qua chat
3. Người nhặt xác nhận đã tìm được chủ sở hữu
4. Hệ thống cập nhật trạng thái bài đăng sang “Đã hoàn thành” và đóng bài đăng

---

### 4.5 Thông báo (Notification)

- Gửi email khi có tin nhắn đầu tiên
- Thông báo khi có người tương tác hoặc yêu cầu nhận đồ
- Thông báo hệ thống từ quản trị viên

---

## 5. Yêu cầu phi chức năng

### 5.1 Bảo mật

- Mật khẩu được mã hóa bằng Bcrypt
- API áp dụng cơ chế Rate Limiting để hạn chế spam

### 5.2 Hiệu năng

- Hình ảnh được nén và resize trước khi lưu trữ
- Tối ưu thời gian tải trang, đặc biệt trên thiết bị di động
---

## 6. Công nghệ sử dụng

### 6.1 Frontend

- Next.js, Tailwind CSS, Shadcn/UI, NextAuth

### 6.2 Backend

- NestJS, Passport.js, Socket.io

### 6.3 Mobile
- React Native, React Native Paper/NativeWind, Expo Notifications

### 6.4 Cơ sở dữ liệu

- PostgreSQL (cơ sở dữ liệu chính)
- ORM: Prisma
- MongoDB (lưu trữ dữ liệu chat)
- ODM: Mongoose

### 6.5 Hạ tầng và DevOps
- DO Droplets, DO Spaces, Docker, Nginx, GitHub Actions, Certbot

## 7. Kiến trúc hệ thống (Tổng quan)

Frontend web, mobile giao tiếp với Backend NestJS thông qua REST API và WebSocket.  
Backend xử lý nghiệp vụ, xác thực, realtime chat và kết nối với các hệ cơ sở dữ liệu.  
Hình ảnh được lưu trữ trên dịch vụ lưu trữ object.

---

## 9. Định hướng phát triển tương lai

- Tự động gợi ý ghép cặp bài mất đồ và nhặt được
- Hệ thống đánh giá độ tin cậy người dùng
- Thông báo đẩy (Push Notification)
- Tích hợp xác minh danh tính nâng cao

---
