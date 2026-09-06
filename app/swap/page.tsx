import type { Metadata } from "next";
import Link from "next/link";
import { JupiterSwapWidget } from "@/components/wallet/jupiter-swap-widget";
import { ArrowUpRight } from "lucide-react";
import styles from "./swap.module.css";

export const metadata: Metadata = {
  title: "Swap IV-SOL | Iron Vault",
  description: "Swap supported Solana assets for verified IV-SOL through Jupiter.",
};

export default function SwapPage() {
  return (
    <div className={styles.swapRoot}>
      <div className={styles.swapContainer}>
        <div className={styles.swapHeader}>
          <div className={styles.headerContent}>
            <h1>Swap for IV-SOL</h1>
            <p>
              Exchange supported Solana assets for the verified IV-SOL token through Jupiter.
            </p>
            <Link href="/docs" className={styles.docsLink}>
              Read the documentation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className={styles.swapWidget}>
          <JupiterSwapWidget />
        </div>

        <div className={styles.swapInfo}>
          <div className={styles.infoCard}>
            <h3>Verified IV-SOL Mint</h3>
            <code>DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV</code>
            <p>Always verify the token address before swapping to prevent impersonator tokens.</p>
          </div>

          <div className={styles.infoCard}>
            <h3>How It Works</h3>
            <ol>
              <li>Connect a supported Solana wallet</li>
              <li>Select your input token (SOL recommended)</li>
              <li>Enter the amount you want to swap</li>
              <li>Review the Jupiter quote</li>
              <li>Approve the transaction in your wallet</li>
            </ol>
          </div>

          <div className={styles.infoCard}>
            <h3>Need Help?</h3>
            <p>
              Check the <Link href="/docs/swap-guide">swap guide</Link> for detailed instructions,
              troubleshooting tips, and common issues.
            </p>
            <p className={styles.disclaimer}>
              Swaps are routed by Jupiter. Availability depends on active market liquidity.
              Iron Vault does not guarantee liquidity, execution price, or that a route will exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
