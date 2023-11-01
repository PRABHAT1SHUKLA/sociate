"use client";

import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";

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
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
              onClick={() => acceptFriend(request.senderId)}
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </Button>

            {/* Cross Button */}
            <Button
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
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
