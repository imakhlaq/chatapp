import { useState } from "react";
import { Check, UserPlus, X } from "lucide-react";

type Props = {
  incomingFriendRequests: IncomingFriendRequests[];
  sessionId: string;
};

class incomingFriendRequests {}

export default function FriendRequest({
  incomingFriendRequests,
  sessionId,
}: Props) {
  const [friendRequest, setFriendRequest] = useState<IncomingFriendRequests[]>(
    incomingFriendRequests,
  );

  function acceptFriend(id: string) {}
  function denyFriend(id: string) {}

  return (
    <>
      {friendRequest?.length === 0 ? (
        <p className="text-sm text-zinc-500">No Friend Request...</p>
      ) : (
        friendRequest?.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              onClick={() => acceptFriend(request.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => denyFriend(request.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
}
