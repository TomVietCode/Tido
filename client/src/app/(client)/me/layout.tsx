import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getProfile } from "@/lib/actions/user.action"
import ProfileSidebar from "@/components/me/ProfileSidebar"

export default async function MeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/")

  const profile = await getProfile()

  return (
    <div className="container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <ProfileSidebar
          fullName={profile.fullName}
          email={profile.email}
          avatarUrl={profile.avatarUrl}
        />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
