/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            // pathname: '/account123/**',
          },
          {
            protocol:'https',
            hostname: 'www.maplestore.in',
            port:''
          },
          {
            protocol:'https',
            hostname: 'encrypted-tbn1.gstatic.com',
            port:''
          },
          {
protocol:'https',
hostname:'m.media-amazon.com',
port:''
          },
          
          
        ],
      },

};

export default config;