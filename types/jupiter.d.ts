interface JupiterFormProps {
  initialInputMint?: string;
  initialOutputMint?: string;
  fixedMint?: string;
  fixedAmount?: boolean;
  swapMode?: "ExactInOrOut";
}

interface JupiterConfig {
  displayMode: "integrated";
  integratedTargetId: string;
  formProps?: JupiterFormProps;
}

interface JupiterPlugin {
  init: (config: JupiterConfig) => void;
}

declare global {
  interface Window {
    Jupiter?: JupiterPlugin;
  }
}

export {};
