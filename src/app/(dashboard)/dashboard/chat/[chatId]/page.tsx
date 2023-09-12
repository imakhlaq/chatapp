import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};
export default async function Page({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  return <div>$</div>;
}
