'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, Copy, ExternalLink, Menu, Search, X } from 'lucide-react'
import { PhantomWalletButton } from '@/components/wallet/phantom-wallet-button'
import { docs, navGroups, token, type DocStatus } from './data'

const statusLabel: Record<DocStatus, string> = {
  LIVE: 'Live',
  PROPOSED: 'Proposed',
  DEVELOPMENT: 'In development',
  FUTURE: 'Future',
}

function CopyValue({ value, label = 'value' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button type="button" className="docs-copy" onClick={copy} title={`Copy ${label}`}>
      <code>{value}</code>
      <span>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

export default function DocsClient() {
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [active, setActive] = useState('welcome')

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return docs.filter((doc) => [doc.title, doc.summary, ...doc.body, ...(doc.bullets ?? [])]
      .join(' ').toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.docs-search input')?.focus()
      }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-22% 0px -66% 0px', threshold: [0, .1, .4, 1] })

    docs.forEach((doc) => {
      const node = document.getElementById(doc.id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setQuery('')
    setMobileNav(false)
  }

  const activeDoc = docs.find((doc) => doc.id === active) ?? docs[0]

  return (
    <div className="docs-app">
      <header className="docs-topbar">
        <Link href="/" className="docs-brand" aria-label="Iron Vault home">
          <span className="docs-brand-mark">IV</span>
          <span><strong>IRON VAULT</strong><small>DOCUMENTATION</small></span>
        </Link>

        <div className="docs-search">
          <Search size={15} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documentation…" aria-label="Search documentation" />
          <kbd>⌘ K</kbd>
          {query && (
            <div className="docs-search-results">
              {searchResults.length ? searchResults.map((result) => (
                <button key={result.id} type="button" onClick={() => jump(result.id)}>
                  <span>{result.label}</span>
                  <strong>{result.title}</strong>
                  <small>{result.summary}</small>
                </button>
              )) : <p>No documentation matched that search.</p>}
            </div>
          )}
        </div>

        <div className="docs-top-actions">
          <Link href="/">Website <ExternalLink size={12} /></Link>
          <PhantomWalletButton />
          <button type="button" className="docs-mobile-menu" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle navigation">
            {mobileNav ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <aside className={`docs-sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="docs-sidebar-scroll">
          {navGroups.map((group) => (
            <section className="docs-nav-group" key={group.label}>
              <h3>{group.label}</h3>
              {group.items.map((item) => (
                <button type="button" key={item.id} className={active === item.id ? 'active' : ''} onClick={() => jump(item.id)}>
                  <span>{item.title}</span>
                  {item.status && item.status !== 'LIVE' ? <i>{statusLabel[item.status]}</i> : null}
                </button>
              ))}
            </section>
          ))}
        </div>
      </aside>

      <main className="docs-main">
        <section className="docs-hero">
          <div className="docs-hero-copy">
            <p>IRON VAULT / ECOSYSTEM DOCUMENTATION</p>
            <h1>Know what exists.<br />Verify what matters.</h1>
            <div className="docs-hero-rule" />
            <p className="docs-lead">The operating manual for Vaulted Academy, IV-SOL, token mechanics, security, wallet connection, roadmap status, and ecosystem policy.</p>
            <div className="docs-hero-actions">
              <button type="button" onClick={() => jump('token-overview')}>Verify IV-SOL <ChevronRight size={15} /></button>
              <button type="button" className="secondary" onClick={() => jump('phantom-connect')}>Connect a wallet</button>
            </div>
          </div>

          <div className="docs-token-card">
            <span className="docs-token-live"><i /> VERIFIED TOKEN DATA</span>
            <h2>{token.symbol}</h2>
            <dl>
              <div><dt>Network</dt><dd>{token.chain}</dd></div>
              <div><dt>Standard</dt><dd>{token.standard}</dd></div>
              <div><dt>Supply</dt><dd>250B</dd></div>
              <div><dt>Decimals</dt><dd>{token.decimals}</dd></div>
            </dl>
            <small>Official mint</small>
            <CopyValue value={token.mint} label="mint address" />
            <a href={`https://solscan.io/token/${token.mint}`} target="_blank" rel="noreferrer">Inspect on Solscan <ExternalLink size={12} /></a>
          </div>
        </section>

        <section className="docs-entry-grid" aria-label="Documentation fast paths">
          <button type="button" onClick={() => jump('academy')}><span>01</span><strong>Vaulted Academy</strong><small>Education, progression, roles and completion</small><ChevronRight size={16} /></button>
          <button type="button" onClick={() => jump('token-overview')}><span>02</span><strong>IV-SOL</strong><small>Token data, supply, fees, allocations and controls</small><ChevronRight size={16} /></button>
          <button type="button" onClick={() => jump('phantom-connect')}><span>03</span><strong>Phantom</strong><small>Non-custodial wallet connection and identity</small><ChevronRight size={16} /></button>
        </section>

        <div className="docs-content">
          {docs.map((doc) => (
            <article id={doc.id} key={doc.id} className="docs-article">
              <div className="docs-article-head">
                <span className="docs-section-label">{doc.label}</span>
                {doc.status ? <span className={`docs-status ${doc.status.toLowerCase()}`}>{statusLabel[doc.status]}</span> : null}
              </div>
              <h2>{doc.title}</h2>
              <p className="docs-summary">{doc.summary}</p>
              {doc.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              {doc.bullets ? <ul>{doc.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}

              {doc.table ? (
                <div className="docs-table-wrap">
                  <table>
                    <thead><tr>{doc.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                    <tbody>{doc.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>{row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell === token.mint ? <CopyValue value={cell} label="mint address" /> : cell}</td>
                      ))}</tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : null}

              {doc.callout ? (
                <div className={`docs-callout ${doc.callout.kind}`}>
                  <strong>{doc.callout.title}</strong>
                  <p>{doc.callout.text}</p>
                </div>
              ) : null}

              {doc.id === 'phantom-connect' ? (
                <div className="docs-phantom-panel">
                  <div className="docs-phantom-copy">
                    <span className="phantom-wallet-mark large">P</span>
                    <div><strong>Connect without handing Iron Vault your keys.</strong><p>Use Phantom to establish a wallet session. A verified Phantom Portal App ID unlocks Google and Apple embedded-wallet onboarding; extension connection works without inventing credentials.</p></div>
                  </div>
                  <PhantomWalletButton />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </main>

      <aside className="docs-toc">
        <strong>ON THIS PAGE</strong>
        <button type="button" className="active">{activeDoc.title}</button>
        {activeDoc.table ? <span>Technical reference</span> : null}
        {activeDoc.bullets ? <span>Key points</span> : null}
        {activeDoc.callout ? <span>{activeDoc.callout.title}</span> : null}
        <div />
        <a href={`https://solscan.io/token/${token.mint}`} target="_blank" rel="noreferrer">Solscan <ExternalLink size={11} /></a>
        <a href="https://member.ironvaulttoken.com" target="_blank" rel="noreferrer">Vaulted Academy <ExternalLink size={11} /></a>
      </aside>
    </div>
  )
}
