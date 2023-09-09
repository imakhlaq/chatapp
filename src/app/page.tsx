import Image from "next/image";
import Button from "@/components/ui/Button";

export default async function Home() {
  return (
    <main className="">
      <Button isLoading={false}>hello</Button>
    </main>
  );
}
