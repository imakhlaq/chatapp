import AddFriendButton from "@/components/AddFriendButton";

type Props = {};
export default function Page({}: Props) {
  return (
    <section className="h-screen flex justify-center items-center flex-col">
      <h2 className="font-bold text-5xl mb-8">Add a friend</h2>
      <AddFriendButton />
    </section>
  );
}
