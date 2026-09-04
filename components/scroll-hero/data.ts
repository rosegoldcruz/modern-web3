export const OVERVIEW_COPY =
  "IV-SOL is the native digital token of the Iron Vault ecosystem, built on Solana using the Token-2022 Program.";

export const MINT_ADDRESS = "DTe8U4RnErPN1CKiJ5HcyZPEAGXMg6j6ueindYuowfjV";
export const TREASURY_ADDRESS = "523vdNYYi44e762Qd7eU6HQGULQsRbsZLYp9g69weAr5";

export type TokenDetail = {
  id: string;
  label: string;
  color: string;
  softColor: string;
  value: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  copyValue?: string;
  secondaryCopyValue?: string;
};

export const TOKEN_DETAILS: readonly TokenDetail[] = [
  {
    id: "quantity",
    label: "Quantity",
    value: "250 Billion Tokens",
    color: "#5b5bf0",
    softColor: "#cbd7ff",
  },
  {
    id: "purpose",
    label: "Purpose",
    value: "Education, participation, recognition, access, community activity, and ecosystem utility within Iron Vault.",
    color: "#e8c94a",
    softColor: "#fff2a8",
  },
  {
    id: "decimals",
    label: "Decimals",
    value: "6",
    color: "#52c93f",
    softColor: "#c8f7bb",
  },
  {
    id: "contract-address",
    label: "Contract Address",
    value: MINT_ADDRESS,
    secondaryLabel: "Treasury / holder account",
    secondaryValue: TREASURY_ADDRESS,
    copyValue: MINT_ADDRESS,
    secondaryCopyValue: TREASURY_ADDRESS,
    color: "#5b5bf0",
    softColor: "#cbd7ff",
  },
  {
    id: "ticker",
    label: "Ticker",
    value: "IV-SOL",
    color: "#ee7200",
    softColor: "#ffd4a3",
  },
  {
    id: "standard",
    label: "Standard",
    value: "Solana Token-2022",
    secondaryLabel: "Token",
    secondaryValue: "Iron Vault · Solana",
    color: "#c9a96e",
    softColor: "#f3e2ba",
  },
] as const;
