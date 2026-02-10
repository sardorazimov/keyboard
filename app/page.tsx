"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const country = localStorage.getItem("country");
    const onboarded = localStorage.getItem("onboarded");

    if (!username) {
      router.replace("/onboarding/username");
    } else if (!country) {
      router.replace("/onboarding/country");
    } else if (!onboarded) {
      router.replace("/onboarding/tutorial");
    } else {
      router.replace("/dashboard");
    }
  }, []);

  return null;
}
