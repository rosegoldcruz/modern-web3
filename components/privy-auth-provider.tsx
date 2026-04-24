"use client"

import type { ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"

type PrivyAuthProviderProps = {
  children: ReactNode
}

export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        loginMethods: ["email", "sms"],
        appearance: {
          theme: "dark",
          accentColor: "#AAFF00",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}