/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://telegram.org https://oauth.telegram.org https://*.privy.io https://*.walletconnect.com https://*.walletconnect.org https://*.leadconnectorhq.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://*.privy.io https://*.leadconnectorhq.com;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://oauth.telegram.org;
              frame-src 'self' https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://oauth.telegram.org https://*.privy.io https://*.walletconnect.com https://*.walletconnect.org https://*.leadconnectorhq.com;
              connect-src 'self' https://auth.privy.io https://*.privy.io wss://*.privy.io https://*.rpc.privy.systems https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://explorer-api.walletconnect.com https://api.mainnet-beta.solana.com wss://api.mainnet-beta.solana.com https://api.relay.link https://*.leadconnectorhq.com;
              worker-src 'self' blob:;
              manifest-src 'self'
            `.replace(/\s+/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

export default nextConfig
