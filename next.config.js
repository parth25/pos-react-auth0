/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { version } = require('./package.json')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

const nextConfig = {
  trailingSlash: true,
  output: 'export',
  distDir: 'dist',
  compress: true,
  reactStrictMode: false,
  generateBuildId: async () => {
    return version
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}

module.exports = nextConfig
