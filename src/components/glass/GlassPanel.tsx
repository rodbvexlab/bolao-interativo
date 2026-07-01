'use client'
import LiquidGlass from 'liquid-glass-react'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
}

export default function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <LiquidGlass
      displacementScale={30}
      blurAmount={0.05}
      saturation={120}
      aberrationIntensity={1}
      elasticity={0.1}
      cornerRadius={20}
      style={{ padding: '32px', width: '100%' }}
      className={className}
    >
      {children}
    </LiquidGlass>
  )
}
