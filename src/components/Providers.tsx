"use client";
import { Toaster } from "react-hot-toast";
import React from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};
const Providers = ({ children }: Props) => {
  return (
    <>
      <SessionProvider>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </SessionProvider>
    </>
  );
};
export default Providers;
