import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Personal metrics dashboard covering GitHub, WakaTime, Umami Analytics, and Web Performance.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
