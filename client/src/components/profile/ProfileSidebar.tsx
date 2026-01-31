"use client";

import { Bookmark, CircleUser, Settings, StickyNote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/lib/actions/user.action";
import { useState } from "react";

interface ProfileSidebarProps {
  user: UserProfile;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: <CircleUser className="w-5 h-5" />,
      label: "Thông tin chung",
      href: "/profile/info",
    },
    {
      icon: <StickyNote className="w-5 h-5" />,
      label: "Tin đã đăng",
      href: "/profile",
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: "Tin đã lưu",
      href: "/profile/saved",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Cài đặt",
      href: "/profile/settings",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/profile") {
      return pathname === "/profile";
    }
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:col-span-3 md:block">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || "https://i.pravatar.cc/80?img=12"}
              className="h-12 w-12 rounded-full"
              alt="avatar"
            />
            <div>
              <p className="font-semibold text-slate-800">{user.fullName}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  isActive(item.href)
                    ? "bg-slate-100 font-semibold text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {typeof item.icon === "string" ? (
                  <span>{item.icon}</span>
                ) : (
                  item.icon
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Toggle Button (Closed) */}
      {!mobileMenuOpen && (
        <button
          className="md:hidden fixed left-0 top-20 z-40 flex h-10 w-8 items-center justify-center rounded-r-lg border border-border/40 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60 text-lg font-semibold"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Mở sidebar"
        >
          &gt;
        </button>
      )}

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed left-0 top-14 z-30 w-64 border-r border-border/40 bg-background overflow-y-auto h-[calc(100vh-80px)]">
          <button
            className="absolute right-0 top-2 z-40 flex h-10 w-8 translate-x-full items-center justify-center rounded-r-lg border border-border/40 bg-background/95 shadow-sm text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Đóng sidebar"
          >
            &lt;
          </button>
          <div className="rounded-none bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || "https://i.pravatar.cc/80?img=12"}
                className="h-12 w-12 rounded-full"
                alt="avatar"
              />
              <div>
                <p className="font-semibold text-slate-800">{user.fullName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                    isActive(item.href)
                      ? "bg-slate-100 font-semibold text-primary"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {typeof item.icon === "string" ? (
                    <span>{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
