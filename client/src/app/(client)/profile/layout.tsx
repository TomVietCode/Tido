import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { getUserProfile } from "@/lib/actions/user.action";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserProfile();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 mt-0 md:px-6 md:py-6">
      <div className="mx-auto w-full max-w-7xl grid grid-cols-12 gap-0 md:gap-6 h-full">
        <ProfileSidebar user={user} />
        <main className="col-span-12 md:col-span-9 mt-12 md:mt-0 space-y-6 px-4 md:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}
