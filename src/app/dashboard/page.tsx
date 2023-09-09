"use client";
import { useSession } from "next-auth/react";

type Props = {};
export default function Page({}: Props) {
  const { data: session } = useSession();
  console.log(session);
  return <div>dashboard</div>;
}
