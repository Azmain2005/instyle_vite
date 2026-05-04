// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["cdn.ishop.cholobangla.com","fakestoreapi.com", "i.postimg.cc","via.placeholder.com", "www.bdshop.com","lh3.googleusercontent.com" ], // add any external domains you use
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
