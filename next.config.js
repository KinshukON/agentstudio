/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static page generation for pages that use useSearchParams
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig

