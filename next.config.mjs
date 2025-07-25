/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour optimiser l'application
  experimental: {
    // Optimisations expérimentales
    serverComponentsExternalPackages: ['openai'],
  },
  
  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Configuration des variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration pour le build
  output: 'standalone',
  
  // Optimisation des images
  images: {
    domains: [],
    unoptimized: false,
  },

  // Configuration TypeScript
  typescript: {
    // !! ATTENTION !!
    // Désactive la vérification TypeScript lors du build
    // Activez uniquement si vous êtes sûr de votre code
    ignoreBuildErrors: false,
  },

  // Configuration ESLint
  eslint: {
    // Désactive ESLint lors du build
    // Activez uniquement pour un déploiement rapide
    ignoreDuringBuilds: false,
  },

  // Configuration des redirections
  async redirects() {
    return []
  },

  // Configuration des rewrites
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
