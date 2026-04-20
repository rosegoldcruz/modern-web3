import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#7B2FBE",
          },
          elements: {
            card: "bg-[#0F0F0F] border border-white/10 shadow-none",
            formButtonPrimary: "bg-[#AAFF00] text-black hover:bg-[#98e600]",
          },
        }}
      />
    </main>
  )
}
