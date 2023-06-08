import { User } from "@prisma/client"
import { FullConversationType } from "../types"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

const useOhterUser = (conversation: FullConversationType | {
  users: User[]
}) => {
  const session = useSession()
  return useMemo(() => {
    const currentUserEmail = session?.data?.user?.email

    return conversation.users.filter(user => user.email !== currentUserEmail)[0]

  }, [session.data?.user?.email])
}

export default useOhterUser