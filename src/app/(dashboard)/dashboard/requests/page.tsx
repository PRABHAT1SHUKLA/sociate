import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helper/redis";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const Page = async ({}) => {
  const session = await getAuthSession();

  // if(!session) return notFound()

  // Ids of people who sent current logged in user a friend request.
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:incoming_friend_requests`
  )) as string[];
  
  // Fetching email of all the user who sent friend request using there Ids
  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`) as string)
      const senderParsed = JSON.parse(sender)
      return {
        senderId,
        senderEmail: senderParsed.email
      }
    })
  )

  return (
    <main >
      <h1 >Add a friend</h1>
      <div>
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session?.user.id} />
      </div>
    </main>
  )
};

export default Page;
