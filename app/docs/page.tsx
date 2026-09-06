import type { Metadata } from "next";
import { DocsClient } from "./DocsClient";

export const metadata: Metadata = {
  title: "Documentation | Iron Vault",
  description: "Technical documentation for IV-SOL and the Iron Vault ecosystem.",
};

export default function DocsPage() {
  return <DocsClient />;
}
