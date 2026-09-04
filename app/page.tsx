import type { Metadata } from "next";
import { IronVaultScroll } from "@/components/scroll-hero/IronVaultScroll";
import { IvNav } from "./iv/IvNav";
import { SmoothScroll } from "./SmoothScroll";

export const metadata: Metadata = {
  title: "Iron Vault | Vaulted Academy",
  description:
    "Build capability for the digital economy through Vaulted Academy, Iron Vault infrastructure, and IV-SOL.",
};

export default function Home() {
  return (
    <SmoothScroll>
      <div className="iv-root">
        <link
          rel="preload"
          href="/animate/ivsol_coin_LIVE.optimized.glb"
          as="fetch"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <IvNav />
        <IronVaultScroll showHeader={false} />
      </div>
    </SmoothScroll>
  );
}
