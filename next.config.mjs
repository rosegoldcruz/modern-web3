const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@solana-program/memo'] = false
    return config
  }
}

export default nextConfig
