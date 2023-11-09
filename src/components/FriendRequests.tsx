"use client";

import { Check, UserPlus, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string | undefined;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter()
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  // Implementing realtime feature  with pusher
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [sessionId])

  // Function To Accept Friend request
  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', { id: senderId })

    setFriendRequests((prev) => 
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }

  // Function to Deny Friend request
  const denyFriend = async (senderId: string) => {
    await axios.post('/api/friends/deny', { id: senderId })

    setFriendRequests((prev) => 
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center'>
            <UserPlus />
            {/* User email */}
            <p>{request.senderEmail}</p>

            {/* Check button */}
            <Button
              aria-label="accept friend"
              className=" bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
              onClick={() => acceptFriend(request.senderId)}
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </Button>

            {/* Cross Button */}
            <Button
              aria-label="deny friend"
              className="bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
              onClick={() => denyFriend(request.senderId)}
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </Button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
