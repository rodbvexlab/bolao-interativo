'use client'
import LiquidGlass from 'liquid-glass-react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <LiquidGlass
      displacementScale={45}
      blurAmount={0.08}
      saturation={130}
      aberrationIntensity={1.5}
      elasticity={0.2}
      cornerRadius={24}
      style={{ padding: '24px', width: '100%' }}
      className={className}
    >
      {children}
    </LiquidGlass>
  )
}
