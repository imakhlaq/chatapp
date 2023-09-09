import Image from "next/image";
import Button from "@/components/ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function Home() {
  //for getting session in serverside
  const session = await getServerSession(authOptions);
  return (
    <main className="">
      <Button isLoading={false}>hello</Button>
    </main>
  );
}
