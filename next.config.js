// Cabeceras de seguridad estáticas. El CSP se define en middleware.js (por ruta:
// nonce estricto en /admin, 'unsafe-inline' enforced en el público — TRI-223).
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Los formatos PDF de trámites se suben por server action (admin); el default
  // de 1MB no alcanza. El archivo real se limita a 10MB (validación + bucket).
  experimental: {
    serverActions: { bodySizeLimit: '12mb' },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
