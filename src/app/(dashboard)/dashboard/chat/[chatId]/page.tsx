import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { fetchRedis } from "@/helper/redis";
import { messageArrayValidator } from "@/lib/validations/messge";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

type Props = {
  params: {
    chatId: string;
  };
};

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1,
    );

    const dbMessage = result.map((message) => JSON.parse(message) as Message);

    const reverseMessage = dbMessage.reverse();

    return messageArrayValidator.parse(reverseMessage);
  } catch (e) {
    console.log("Error");

    // @ts-ignore
    console.log(e.message);
  }
}

export default async function Page({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);
  console.log({ session });

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id !== userId1 && user.id !== userId2) return notFound();

  //finding who is the chat Partner
  const chatPartnerId = session.user.id === userId1 ? userId2 : userId1;
  console.log(chatPartnerId);

  const chatPartnerDetails = await fetchRedis("get", `user:${chatPartnerId}`);

  const chatPartnerParsed = JSON.parse(chatPartnerDetails) as User;

  const initialMessages = await getChatMessages(chatId);
  console.log(initialMessages);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartnerParsed.image}
                alt={`${chatPartnerParsed.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartnerParsed.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">
              {chatPartnerParsed.email}
            </span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartnerParsed}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartnerParsed} />
    </div>
  );
}
