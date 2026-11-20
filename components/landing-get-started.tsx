"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingGetStarted() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/home")}
      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-md transition-all duration-300 hover:scale-105"
    >
      Start Watching Now
    </Button>
  );
}