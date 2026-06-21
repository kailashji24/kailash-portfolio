import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:          '#0A1428',
        navyLight:     '#0D1B2E',
        ocean:         '#1B3A5B',
        oceanMid:      '#2C5F7C',
        gold:          '#E8B23A',
        goldBright:    '#F2C94C',
        textPrimary:   '#E8EDF2',
        textSecondary: '#8FA3B8',
      },
    },
  },
  plugins: [],
}

export default config
