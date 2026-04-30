import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'outline' | 'success' | 'neutral'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyle: Record<string, React.CSSProperties> = {
    sm: { paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.875rem' },
    md: { paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', fontSize: '1rem' },
    lg: { paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', fontSize: '1rem', whiteSpace: 'nowrap' },
  }

  const variantStyle: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary)', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' },
    outline: { backgroundColor: '#ffffff', color: '#000000', border: '1.5px solid #000000' },
    success: { backgroundColor: 'var(--color-secondary-bright)', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' },
    neutral: { backgroundColor: 'var(--color-neutral)', color: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)' },
  }

  const hoverAnimation: Record<string, object> = {
    primary: { backgroundColor: 'var(--color-primary-hover)' },
    outline: { backgroundColor: '#000000', color: '#ffffff' },
    success: { backgroundColor: 'var(--color-secondary)' },
    neutral: { opacity: 0.8 },
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={hoverAnimation[variant]}
      transition={{ duration: 0.2 }}
      style={{
        ...variantStyle[variant],
        ...sizeStyle[size],
        ...(fullWidth ? { width: '100%' } : {}),
      }}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <svg
            style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Memuat...
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}
