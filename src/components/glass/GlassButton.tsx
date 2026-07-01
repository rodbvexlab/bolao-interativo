'use client'
import LiquidGlass from 'liquid-glass-react'

interface GlassButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export default function GlassButton({
  label,
  onClick,
  disabled = false,
  className,
}: GlassButtonProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`inline-block ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className ?? ''}`}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick?.()
      }}
    >
      <LiquidGlass
        displacementScale={64}
        blurAmount={0.1}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0.35}
        cornerRadius={100}
        style={{ padding: '12px 28px' }}
      >
        <span
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: '1rem',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </LiquidGlass>
    </div>
  )
}
