/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "res-console.cloudinary.com",
        port: "",
        pathname: "/dgtac4atn/**",
        search: "",
      },
    ],
  },
  images: {
    domains: ["res-console.cloudinary.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
