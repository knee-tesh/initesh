/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  appDir: true,
  async redirects() {
    return [
      { source: "/projects/:path*", destination: "/work/:path*", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/services/:path*", destination: "/contact", permanent: true },
      { source: "/services", destination: "/contact", permanent: true },
    ];
  },
}

module.exports = nextConfig
