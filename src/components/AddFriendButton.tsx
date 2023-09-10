"use client";
import Button from "@/components/ui/Button";
import { addFriendValidator } from "@/lib/validations/validation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof addFriendValidator>;

type Props = {};
export default function AddFriendButton({}: Props) {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(addFriendValidator),
  });

  async function addFriends(email: string) {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      const res = await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      console.log(res.data);
      setShowSuccessState(true);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError("email", { message: e.message });
        return;
      }
      if (e instanceof AxiosError) {
        setError("email", { message: e.response?.data.message });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  }

  function onSubmit(data: FormData) {
    addFriends(data.email);
  }

  return (
    <form
      className="max-w-lg md:min-w-[25rem]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-950"
      >
        Add friend by E-mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="email"
          required
          name="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm px-3 text-lg"
          placeholder="you@example.com"
        />
        <Button isLoading={false}>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend Request Send</p>
      ) : null}
    </form>
  );
}
