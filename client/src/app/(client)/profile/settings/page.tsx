import { getUserProfile } from "@/lib/actions/user.action";

export default async function ProfileSettingsPage() {
  const user = await getUserProfile();

  return (
    <div className="w-full">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-5">Cài đặt</h1>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Bảo mật
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Quản lý mật khẩu và bảo mật tài khoản
            </p>
            <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              Đổi mật khẩu
            </button>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Thông báo
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Quản lý cài đặt thông báo
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-slate-600">
                  Nhận thông báo email khi tin được tìm thấy
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <span className="text-slate-600">
                  Nhận thông báo về tin mới phù hợp
                </span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Nguy hiểm
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Hành động không thể khôi phục
            </p>
            <button className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600">
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
