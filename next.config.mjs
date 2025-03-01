/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/dashboards/academy',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fr|ar)',
        destination: '/:lang/dashboards/academy',
        permanent: true,
        locale: false
      },
      {
        source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\\b)):path',
        destination: '/en/:path',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
