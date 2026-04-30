import { motion } from 'framer-motion'

interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Color variant */
  color?: 'primary' | 'secondary' | 'tertiary'
  /** Show percentage label */
  showLabel?: boolean
  /** Height size */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
}

const trackColors = {
  primary: 'bg-primary-light',
  secondary: 'bg-secondary-light',
  tertiary: 'bg-tertiary-light',
}

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export default function ProgressBar({
  value,
  color = 'primary',
  showLabel = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-text-light">Progres</span>
          <span className="text-sm font-semibold text-text">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div
        className={`
          w-full rounded-full overflow-hidden
          ${trackColors[color]}
          ${sizeStyles[size]}
        `}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progres ${Math.round(clampedValue)}%`}
      >
        <motion.div
          className={`h-full rounded-full ${colorStyles[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
