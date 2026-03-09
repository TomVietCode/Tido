import { getProfile } from "@/lib/actions/user.action"
import ProfileContent from "@/components/me/ProfileContent"

export default async function MePage() {
  const profile = await getProfile()

  return <ProfileContent profile={profile} />
}
