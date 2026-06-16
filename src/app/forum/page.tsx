import type { Metadata } from "next";
import ForumClient from "@/components/ForumClient";

export const metadata: Metadata = {
  title: "Forum & Reviews",
  description: "Discussion forum and project reviews. Rate, leave comments, and interact with the creator.",
};

export default function ForumPage() {
  return <ForumClient />;
}
