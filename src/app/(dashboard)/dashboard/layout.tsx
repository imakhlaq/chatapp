import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/Icons";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-amber-100 bg-white px-6">
        <Link href="/dashboard" className="flexh h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600  mt-4" />
        </Link>
        <div className="text-xs font-semibold leading-6 text-gray-400 mt-14">
          Your chats
        </div>
        <nav className="flex flex-1 flex-col"></nav>
      </div>
      {children}
    </div>
  );
}
