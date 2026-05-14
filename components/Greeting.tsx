"use client";

import { useEffect, useState } from "react";

function pickGreeting(hour: number): string {
  if (hour < 5) return "It’s late. Welcome back.";
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  if (hour < 22) return "Good evening.";
  return "A quiet hour.";
}

export function Greeting({ className }: { className?: string }) {
  // Render a neutral fallback during SSR to avoid hydration mismatch,
  // then replace with the local time-aware greeting on the client.
  const [text, setText] = useState<string>("Welcome back.");

  useEffect(() => {
    setText(pickGreeting(new Date().getHours()));
  }, []);

  return <span className={className}>{text}</span>;
}
