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
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex gap-8">
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
