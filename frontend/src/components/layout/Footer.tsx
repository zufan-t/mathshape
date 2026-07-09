import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'

// Footer spec (component.txt lines 281-287):
// Container: top-left rounded · top-right rounded · background #EBF5FF
// Content:
//   - Nama website: Heading-1 (32px) · Plus Jakarta Sans
//   - Kontak, Tentang kami, Copyright: Body text-2 (14px) · Be Vietnam Pro

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="footer"
      style={{
        width: '100%',
        backgroundColor: 'var(--color-footer, #EBF5FF)',
        // top-left dan top-right rounded, bottom flat
        borderRadius: '24px 24px 0 0',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        {/* Nama website — Heading-1 (32px) — primary blue */}
        <Link
          to={ROUTES.HOME}
          id="footer-logo"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '32px',
            background: 'linear-gradient(135deg, #007BFF 0%, #7C299D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'opacity 200ms',
          }}
          className="hover:opacity-80"
        >
          {APP_NAME}
        </Link>

        {/* Kontak + Tentang kami — Body text-2 (14px) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to={ROUTES.FAQ}
            id="footer-link-kontak"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              transition: 'color 200ms',
            }}
            className="hover:text-primary"
          >
            Kontak
          </Link>
          <Link
            to={ROUTES.ABOUT}
            id="footer-link-tentang"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              transition: 'color 200ms',
            }}
            className="hover:text-primary"
          >
            Tentang kami
          </Link>
        </div>

        {/* Copyright — Body text-2 (14px) */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          @{currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  )
}
