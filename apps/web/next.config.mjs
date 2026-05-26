import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dir }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@db': path.resolve(dir, '../../packages/db/src'),
      '@ui': path.resolve(dir, '../../packages/ui/src'),
      '@lib': path.resolve(dir, '../../packages/lib/src'),
    }
    return config
  },
}

export default nextConfig
