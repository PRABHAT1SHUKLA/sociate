import { getFriendsByUserId } from "@/helper/get-friends-by-user-id";
import { fetchRedis } from "@/helper/redis";
import { getAuthSession } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const page = async () => {
  // This page shows the recent Chats done by user
  const session = await getAuthSession();
  if (!session) return notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      // This is a modification, I found a bug in josh project that when new user signin there is no chat or messages then this lastMessageRaw is undefiend that why we cannot parse it to json it gives error.that's why I have added a If Statement below this and returning lastMessage as null so that in jsx we conditional render that if lastMessage === null then return "" empty string.
      if(lastMessageRaw === undefined) {
        return {...friend, lastMessage: null}
      }
      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
         lastMessage,
      };
    })
  );
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => {
          // Added if statement for modification, bug in josh code.
          if(friend.lastMessage === null) return ""

          return (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id
                      ? "You: "
                      : ""}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        )})
      )}
    </div>
  );
};

export default page;
