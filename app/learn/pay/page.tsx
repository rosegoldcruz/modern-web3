'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useFundWallet } from '@privy-io/react-auth/solana'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');`

const CSS = `
  ${FONTS}
  *{box-sizing:border-box;margin:0;padding:0;}
  .pv{
    min-height:100vh;
    background:#080808;
    color:#E8E8E8;
    font-family:'DM Sans',sans-serif;
    position:relative;overflow-x:hidden;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:60px 24px;
  }
  .pv::before{
    content:'';position:fixed;inset:0;
    background-image:
      linear-gradient(rgba(123,47,190,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(123,47,190,0.04) 1px,transparent 1px);
    background-size:80px 80px;
    pointer-events:none;z-index:0;
  }
  .pv::after{
    content:'';position:fixed;top:-300px;right:-300px;
    width:800px;height:800px;
    background:radial-gradient(circle,rgba(123,47,190,0.08) 0%,transparent 70%);
    pointer-events:none;z-index:0;
  }
  .pv-inner{position:relative;z-index:1;width:100%;max-width:1100px;}
  .pv-eyebrow{
    font-family:'Space Mono',monospace;font-size:9px;
    letter-spacing:3px;color:#AAFF00;margin-bottom:10px;text-align:center;
  }
  .pv-h1{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(42px,6vw,72px);line-height:1;letter-spacing:2px;
    color:#fff;text-align:center;margin-bottom:10px;
  }
  .pv-sub{
    font-size:14px;color:#555;line-height:1.7;
    max-width:480px;margin:0 auto 48px;text-align:center;
  }
  .pv-phantom-strip{
    display:flex;align-items:center;justify-content:center;
    gap:12px;margin-bottom:44px;
  }
  .pv-phantom-connected{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#AAFF00;border:1px solid rgba(170,255,0,0.3);
    background:rgba(170,255,0,0.04);
    padding:8px 18px;border-radius:2px;
  }
  .pv-phantom-btn{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#7B2FBE;border:1px solid rgba(123,47,190,0.3);
    background:rgba(123,47,190,0.06);
    padding:8px 18px;border-radius:2px;cursor:pointer;transition:all 0.2s;
  }
  .pv-phantom-btn:hover{border-color:#7B2FBE;color:#fff;}
  .pv-phantom-btn:disabled{opacity:0.4;cursor:not-allowed;}
  .pv-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    gap:16px;margin-bottom:52px;
  }
  .pv-card{
    background:#0F0F0F;border:1px solid #1A1A1A;
    border-radius:4px;padding:28px 24px;
    position:relative;overflow:hidden;transition:all 0.2s;
    animation:fadeUp 0.4s ease both;
  }
  .pv-card:hover{border-color:rgba(123,47,190,0.4);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .pv-card::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#7B2FBE,transparent);
  }
  .pv-card.featured{border-color:rgba(170,255,0,0.25);}
  .pv-card.featured::before{background:linear-gradient(90deg,transparent,#AAFF00,transparent);}
  .pv-featured-badge{
    position:absolute;top:-1px;left:50%;transform:translateX(-50%);
    background:#AAFF00;color:#080808;
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    padding:4px 14px;font-weight:700;
  }
  .pv-tag{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    color:#7B2FBE;margin-bottom:8px;
  }
  .pv-price{
    font-family:'Bebas Neue',sans-serif;
    font-size:52px;line-height:1;letter-spacing:1px;
    color:#fff;margin-bottom:2px;
  }
  .pv-price-label{
    font-family:'Space Mono',monospace;font-size:9px;
    color:#444;letter-spacing:1px;margin-bottom:16px;
  }
  .pv-allocation{
    font-family:'Bebas Neue',sans-serif;font-size:18px;
    letter-spacing:1px;color:#AAFF00;margin-bottom:4px;
  }
  .pv-desc{font-size:12px;color:#444;line-height:1.6;margin-bottom:24px;}
  .pv-divider{height:1px;background:#141414;margin-bottom:20px;}
  .pv-btn{
    width:100%;border:none;border-radius:3px;
    padding:15px;font-family:'Bebas Neue',sans-serif;
    font-size:16px;letter-spacing:2px;cursor:pointer;transition:all 0.2s;
  }
  .pv-btn-lime{background:#AAFF00;color:#080808;}
  .pv-btn-lime:hover{background:#BFFF33;transform:translateY(-1px);}
  .pv-btn-ghost{
    background:transparent;
    border:1px solid rgba(255,255,255,0.12);color:#666;
  }
  .pv-btn-ghost:hover{border-color:rgba(123,47,190,0.4);color:#E8E8E8;}
  .pv-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .pv-status{
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#7B2FBE;text-align:center;margin-bottom:16px;
  }
  .pv-phone{text-align:center;margin-bottom:32px;}
  .pv-phone-label{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    color:#333;margin-bottom:10px;
  }
  .pv-phone-num{
    font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;
    color:#AAFF00;text-decoration:none;transition:opacity 0.2s;
  }
  .pv-phone-num:hover{opacity:0.8;}
  .pv-legal{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1px;
    color:#2A2A2A;text-align:center;max-width:480px;margin:0 auto;line-height:1.8;
  }
  .pv-loading{
    min-height:100vh;background:#080808;
    display:flex;align-items:center;justify-content:center;
    font-family:'Space Mono',monospace;font-size:10px;
    letter-spacing:3px;color:#AAFF00;
  }
  @keyframes fadeUp{
    from{opacity:0;transform:translateY(14px);}
    to{opacity:1;transform:translateY(0);}
  }
  @media(max-width:768px){
    .pv-grid{grid-template-columns:1fr;}
    .pv{padding:40px 16px;}
  }
`

const TIERS = [
  { name: 'MODULE', tag: 'SINGLE MODULE', price: 25, tokens: '25,000', label: '$25', usdcAmount: '25', usdcRaw: 25_000_000, description: 'Module 1 access + 25,000 IV-SOL — buy more modules anytime' },
  { name: 'STARTER', tag: 'FOUNDATION', price: 100, tokens: '100,000', label: '$100', usdcAmount: '100', usdcRaw: 100_000_000, description: 'All 6 modules + 100,000 IV-SOL — save $50 vs buying individually' },
  { name: 'BUILDER', tag: 'ACCELERATOR', price: 500, tokens: '500,000', label: '$500', usdcAmount: '500', usdcRaw: 500_000_000, description: 'All 6 modules + 500,000 IV-SOL allocation' },
  { name: 'FOUNDER', tag: 'ELITE', price: 1000, tokens: '1,000,000', label: '$1,000', usdcAmount: '1000', usdcRaw: 1_000_000_000, description: 'All 6 modules + 1,000,000 IV-SOL allocation' },
]

const TREASURY = '6qGsnyBmB78f9YUPQp9PLFfKjJu3rDwJYLWtbxSD7mSt'
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!

function PayPageContent() {
  const { user, authenticated, ready, login, linkWallet } = usePrivy()
  const { wallets } = useWallets()
  const { fundWallet } = useFundWallet()
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedModule = Number(searchParams.get('module'))
  const selectedModule = Number.isInteger(requestedModule)
    ? Math.min(Math.max(requestedModule, 1), 6)
    : 1
  const [checking, setChecking] = useState(true)
  const [funding, setFunding] = useState(false)
  const [status, setStatus] = useState('')
  const [linkingPhantom, setLinkingPhantom] = useState(false)

  const phantomWallet = wallets.find(w => w.walletClientType === 'phantom')
  const embeddedSolanaWallet = wallets.find(w => (w as any).chainType === 'solana' && w.walletClientType === 'privy')
  const activeWallet = phantomWallet ?? embeddedSolanaWallet

  useEffect(() => {
    if (!ready) return
    if (!authenticated) { setChecking(false); return }
    fetch('/api/check-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id })
    })
      .then(r => r.json())
      .then(d => {
        const targetModule = `module_${selectedModule}`
        const alreadyUnlocked = d.modulesUnlocked?.includes(targetModule)
        const isTargetedModulePurchase = searchParams.has('module')

        if (d.paid && (!isTargetedModulePurchase || alreadyUnlocked)) router.replace('/learn')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [ready, authenticated, user, router, searchParams, selectedModule])

  const handleConnectPhantom = async () => {
    setLinkingPhantom(true)
    try { await linkWallet() } catch (e) { console.error(e) }
    setLinkingPhantom(false)
  }

  const handleFund = async (tier: typeof TIERS[0]) => {
    if (!authenticated) { login(); return }

    let address = activeWallet?.address
    if (!address) {
      const fallback = user?.linkedAccounts?.find(
        (a: any) => a.type === 'wallet' && a.chainType === 'solana'
      ) as any
      address = fallback?.address
    }
    if (!address) {
      alert('No Solana wallet found. Connect Phantom or sign out and back in.')
      return
    }

    setFunding(true)
    setStatus('▸ OPENING PAYMENT...')

    try {
      await fundWallet({ address, options: { amount: tier.usdcAmount } })

      setStatus('▸ CONFIRMING ON-CHAIN...')
      const connection = new Connection(RPC, 'confirmed')
      const senderPubkey = new PublicKey(address)
      const treasuryPubkey = new PublicKey(TREASURY)
      const senderATA = await getAssociatedTokenAddress(USDC_MINT, senderPubkey)
      const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, treasuryPubkey)

      const transferIx = createTransferInstruction(
        senderATA, treasuryATA, senderPubkey,
        tier.usdcRaw, [], TOKEN_PROGRAM_ID
      )

      const tx = new Transaction().add(transferIx)
      const { blockhash } = await connection.getLatestBlockhash()
      tx.recentBlockhash = blockhash
      tx.feePayer = senderPubkey

      const walletToUse = phantomWallet ?? embeddedSolanaWallet
      if (!walletToUse) throw new Error('No wallet available to sign')

      const signedTx = await (walletToUse as any).sendTransaction(tx, connection)

      setStatus('▸ RECORDING ACCESS...')
      await connection.confirmTransaction(signedTx, 'confirmed')

      await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          walletAddress: address,
          txSignature: signedTx,
          tier: tier.name,
          amount: tier.price,
          selectedModule,
        })
      })

      router.replace('/learn')

    } catch (e: any) {
      console.error(e)
      setStatus('')
      alert(e?.message ?? 'Payment failed. Please try again.')
    }

    setFunding(false)
  }

  if (checking) return (
    <div className="pv-loading">
      <style>{CSS}</style>
      ▸ VERIFYING ACCESS...
    </div>
  )

  return (
    <div className="pv">
      <style>{CSS}</style>
      <div className="pv-inner">

        <div className="pv-eyebrow">▸ FOUNDING MEMBER ACCESS</div>
        <h1 className="pv-h1">Choose Your Track</h1>
        <p className="pv-sub">
          Complete the coursework. Receive your IV-SOL allocation automatically.
          No agent. No manual process. The certificate triggers delivery.
        </p>

        {authenticated && (
          <div className="pv-phantom-strip">
            {phantomWallet ? (
              <div className="pv-phantom-connected">
                ✓ PHANTOM — {phantomWallet.address.slice(0, 4)}...{phantomWallet.address.slice(-4)}
              </div>
            ) : (
              <button
                className="pv-phantom-btn"
                onClick={handleConnectPhantom}
                disabled={linkingPhantom}
              >
                {linkingPhantom ? '▸ CONNECTING...' : '+ CONNECT PHANTOM WALLET'}
              </button>
            )}
          </div>
        )}

        {funding && <div className="pv-status">{status}</div>}

        <div className="pv-grid">
          {TIERS.map((tier, i) => {
            const isRequestedModuleTier = tier.name === 'MODULE' && searchParams.has('module')
            const featured = tier.name === 'FOUNDER' || isRequestedModuleTier
            const description = isRequestedModuleTier
              ? `Unlock Module ${selectedModule} + 25,000 IV-SOL — buy more modules anytime`
              : tier.description
            return (
              <div
                key={tier.name}
                className={`pv-card ${featured ? 'featured' : ''}`}
                style={{ animationDelay: `${i * 0.07}s`, paddingTop: featured ? '36px' : '28px' }}
              >
                {featured && <div className="pv-featured-badge">{isRequestedModuleTier ? `MODULE ${selectedModule}` : 'FOUNDER'}</div>}
                <div className="pv-tag">▸ {tier.tag}</div>
                <div className="pv-price">{tier.label}</div>
                <div className="pv-price-label">IN COURSEWORK</div>
                <div className="pv-allocation">→ {tier.tokens} IV-SOL</div>
                <div className="pv-desc">{description}</div>
                <div className="pv-divider" />
                <button
                  onClick={() => handleFund(tier)}
                  disabled={funding}
                  className={`pv-btn ${featured ? 'pv-btn-lime' : 'pv-btn-ghost'}`}
                >
                  {!authenticated
                    ? 'SIGN IN TO ENROLL'
                    : funding
                    ? status || 'PROCESSING...'
                    : 'START LEARNING NOW'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="pv-phone">
          <div className="pv-phone-label">▸ PREFER TO ENROLL BY PHONE?</div>
          <a href="tel:8883682502" className="pv-phone-num">(888) 368-2502</a>
        </div>

        <div className="pv-legal">
          IV-SOL IS A UTILITY TOKEN — NOT A STOCK OR SECURITY.<br />
          IT DOES NOT GUARANTEE FINANCIAL RETURNS.<br />
          CRYPTO MARKETS ARE VOLATILE. PARTICIPATION INVOLVES RISK.
        </div>

      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="pv-loading">
        <style>{CSS}</style>
        ▸ VERIFYING ACCESS...
      </div>
    }>
      <PayPageContent />
    </Suspense>
  )
}
