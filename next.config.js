/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
    async rewrites() {
        return [
          {
            source: "/api/:path*", // Mapeia chamadas para /api/*
            destination: "https://go-messenger.onrender.com/:path*", // Redireciona para o backend
          },
        ];
    },
    env: {
        WS_URL: process.env.WS_URL || 'ws://127.0.0.1:3000',
    },
};
module.exports = nextConfig
