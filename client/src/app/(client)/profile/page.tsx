import { CircleUser } from "lucide-react"
export default function ProfilePostsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <aside className="col-span-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=12"
                className="h-12 w-12 rounded-full"
                alt="avatar"
              />
              <div>
                <p className="font-semibold text-slate-800">Lê Văn C</p>
                <p className="text-sm text-slate-500">
                  c.le@st.phenikaa-uni.edu.vn
                </p>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
                <CircleUser />
                <span>Thông tin chung</span>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 font-semibold text-primary">
                <span>📄</span>
                <span>Tin đã đăng</span>
              </div>

              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
                <span>🔖</span>
                <span>Tin đã lưu</span>
              </div>

              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
                <span>⚙️</span>
                <span>Cài đặt</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN */}
        <main className="col-span-9 space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">Tin đã đăng</h1>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-slate-500">Số tin đã đăng</p>
              <p className="mt-2 text-3xl font-bold">5</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-slate-500">Đã tìm thấy</p>
              <p className="mt-2 text-3xl font-bold">2</p>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex gap-2">
            <button className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-primary">
              Tất cả
            </button>
            <button className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              Đang hiển thị
            </button>
            <button className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              Đã ẩn/Đã xong
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-3">SẢN PHẨM</th>
                  <th className="px-6 py-3">NGÀY ĐĂNG</th>
                  <th className="px-6 py-3">TRẠNG THÁI</th>
                  <th className="px-6 py-3 text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://i.imgur.com/6IUbEME.png"
                        className="h-10 w-10 rounded-md"
                        alt=""
                      />
                      <span className="font-medium">
                        Bình nước giữ nhiệt màu đen
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">02/05/2024</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Đang tìm
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button>✏️</button>
                    <button className="text-red-500">🗑</button>
                    <button className="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      Đã tìm thấy
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://i.imgur.com/Xh9YxXG.png"
                        className="h-10 w-10 rounded-md"
                        alt=""
                      />
                      <span className="font-medium">
                        Hộp tai nghe Airpods Pro
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">28/04/2024</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Đã xong
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button>✏️</button>
                    <button className="text-red-500">🗑</button>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://i.imgur.com/9z4K6oT.png"
                        className="h-10 w-10 rounded-md"
                        alt=""
                      />
                      <span className="font-medium">
                        Thẻ sinh viên và CCCD
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">15/04/2024</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Đang tìm
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button>✏️</button>
                    <button className="text-red-500">🗑</button>
                    <button className="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      Đã tìm thấy
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
