const nextConfig = {
  async redirects() {
    return [
      {
        source: "/learn",
        destination: "https://member.ironvaulttoken.com/learn",
        permanent: false,
      },
      {
        source: "/learn/module-0",
        destination: "https://member.ironvaulttoken.com/learn/module-0",
        permanent: false,
      },
      {
        source: "/academy/module-0",
        destination: "https://member.ironvaulttoken.com/learn/module-0",
        permanent: false,
      },
      {
        source: "/learn/free",
        destination: "https://member.ironvaulttoken.com/learn/module-0",
        permanent: false,
      },
      {
        source: "/academy",
        destination: "https://member.ironvaulttoken.com/learn/module-0",
        permanent: false,
      },
      {
        source: "/learn/academy",
        destination: "https://member.ironvaulttoken.com/learn/module-0",
        permanent: false,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias['@solana-program/memo'] = false
    return config
  }
}

export default nextConfig
