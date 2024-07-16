/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  rewrites: async () => {
    const rewriteRules = [
      {
        source: "/api/py/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/py/:path*`,
      },
      {
        source: "/docs",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/py/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/py/openapi.json`,
      },
    ];
    return rewriteRules;
  },
};

module.exports = nextConfig;