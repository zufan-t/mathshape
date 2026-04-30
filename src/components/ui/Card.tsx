import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`
        bg-white rounded-xl shadow-md
        ${paddingStyles[padding]}
        ${hoverable ? 'cursor-pointer hover:shadow-lg' : ''}
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
