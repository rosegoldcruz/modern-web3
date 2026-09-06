"use client";

import { useEffect, useRef } from "react";

const IVSOL_MINT = "DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV";
const SOL_MINT = "So11111111111111111111111111111111111111112";

export function JupiterSwapWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initializeJupiter = async () => {
      try {
        // Load Jupiter plugin script
        const script = document.createElement("script");
        script.src = "https://plugin.jup.ag/plugin-v1.js";
        script.async = true;

        script.onload = () => {
          // Initialize Jupiter with verified mints
          if (window.Jupiter) {
            window.Jupiter.init({
              displayMode: "integrated",
              integratedTargetId: "jupiter-widget",
              formProps: {
                initialInputMint: SOL_MINT,
                initialOutputMint: IVSOL_MINT,
                fixedMint: IVSOL_MINT,
                fixedAmount: false,
                swapMode: "ExactInOrOut",
              },
            });
          }
        };

        document.body.appendChild(script);

        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (error) {
        console.error("Failed to load Jupiter widget:", error);
      }
    };

    void initializeJupiter();
  }, []);

  return (
    <div ref={containerRef} className="jupiter-container">
      <div id="jupiter-widget" style={{ minHeight: "400px" }} />
      <p className="jupiter-disclaimer">
        Swaps are routed by Jupiter. Availability depends on active market liquidity and a valid Jupiter route.
        Iron Vault does not guarantee liquidity, execution price, or that a route will exist.
      </p>
    </div>
  );
}
