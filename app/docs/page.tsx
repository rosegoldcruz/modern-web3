import type { Metadata } from 'next'
import DocsClient from './DocsClient'
import './docs.css'

export const metadata: Metadata = {
  title: 'Iron Vault Documentation | IV-SOL & Vaulted Academy',
  description: 'Official Iron Vault documentation for Vaulted Academy, IV-SOL, token mechanics, security, Phantom wallet connectivity, roadmap status, and ecosystem policy.',
}

export default function DocsPage() {
  return <DocsClient />
}
