# Skill: Liquid Glass

## Biblioteca
npm: liquid-glass-react ^1.1.1
Import: import LiquidGlass from 'liquid-glass-react'
Sempre "use client"

## GlassCard (cards de conteúdo)
displacementScale={45} blurAmount={0.08} saturation={130}
aberrationIntensity={1.5} elasticity={0.2} cornerRadius={24} padding="24px"

## GlassButton (CTAs)
displacementScale={64} blurAmount={0.1} saturation={130}
aberrationIntensity={2} elasticity={0.35} cornerRadius={100} padding="12px 28px"

## GlassPanel (admin e modais)
displacementScale={30} blurAmount={0.05} saturation={120}
aberrationIntensity={1} elasticity={0.1} cornerRadius={20} padding="32px"

## Atenção
- Safari/Firefox: displacement não renderiza — comportamento esperado, não é bug
- Nunca usar SSR — sempre "use client"
- Nunca aninhar LiquidGlass dentro de LiquidGlass
- Fundo escuro (#08080F) potencializa o efeito
