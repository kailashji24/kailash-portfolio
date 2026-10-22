import type { Config } from 'tailwindcss'
import { theme } from './src/theme'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ...theme.colors },
      fontFamily: {
        display: [theme.fonts.display],
        body: [theme.fonts.body],
      },
    },
  },
  plugins: [],
}

export default config
