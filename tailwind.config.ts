import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'var(--color-foreground)',
            h1: {
              fontSize: '2rem',
              fontWeight: '700',
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.3',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
            },
            a: {
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            code: {
              color: 'var(--color-foreground)',
              backgroundColor: 'var(--color-muted)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              overflow: 'auto',
            },
            blockquote: {
              borderLeftColor: 'var(--color-border)',
              color: 'var(--color-muted-foreground)',
            },
            hr: {
              borderColor: 'var(--color-border)',
            },
            ul: {
              listStyleType: 'disc',
            },
            ol: {
              listStyleType: 'decimal',
            },
            'ul, ol': {
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            th: {
              backgroundColor: 'var(--color-muted)',
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              borderBottom: '1px solid var(--color-border)',
            },
            td: {
              padding: '0.75rem',
              borderBottom: '1px solid var(--color-border)',
            },
          },
        },
        sm: {
          css: {
            fontSize: '12px',
            lineHeight: '1.5',
          },
        },
        lg: {
          css: {
            fontSize: '16px',
            lineHeight: '1.7',
          },
        },
        xl: {
          css: {
            fontSize: '18px',
            lineHeight: '1.8',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
