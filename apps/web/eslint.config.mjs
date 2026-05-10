// ESLint flat config — Next.js 16 + TypeScript
// Menggunakan native flat config dari eslint-config-next 16.x

import nextConfig from 'eslint-config-next'
import nextCWV from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default [
  ...nextConfig,
  ...nextCWV,
  ...nextTs,
  {
    // Custom rules overrides
    rules: {
      // Izinkan img tag di samping Next.js Image (untuk kasus khusus)
      '@next/next/no-img-element': 'warn',
      // React 19 tidak perlu import React
      'react/react-in-jsx-scope': 'off',
      // Izinkan variabel dengan prefix underscore (konvensi "sengaja tidak dipakai")
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
  {
    // Abaikan file generated dan build output
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'scripts/**',
    ],
  },
]
