'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAppContext } from "@/src/context/AppContext";
import LandingPage from "@/src/components/LandingPage";
import Loading from "@/src/components/Loading";

const Page = () => {
  const { isAuth, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuth && !loading) {
      router.push("/chat");
    }
  }, [isAuth, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (isAuth) {
    return null; // Will redirect via useEffect
  }

  return <LandingPage />;
};

export default Page;