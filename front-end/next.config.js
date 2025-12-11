import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    // Leverage Node.js 24.x performance optimizations
    experimental: {
        optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    },

    // Static export configuration for IIS deployment
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',

    // Image optimization for static export
    images: {
        unoptimized: true,
    },

    // Performance optimizations for Node.js 24.x
    reactStrictMode: true,
    compress: true,

    // Modern build optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },

    // Environment variables for runtime configuration
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
    },
};

export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);