# Skill: Frontend Design

## Identidade visual
Dark premium. Sofisticado, tecnológico, cor de destaque variável por tenant.

## CSS vars obrigatórias (globals.css)
--bg-base: #08080F
--bg-surface: #0F0F1A
--bg-elevated: #16162A
--border: rgba(255,255,255,0.06)
--text-primary: #F4F4F5
--text-secondary: #A1A1AA
--accent: var(--tenant-color, #7C3AED)
--accent-glow: color-mix(in srgb, var(--accent) 25%, transparent)

## Tipografia
Display: Syne 700/800 — Google Fonts
Body: Inter 400/500 — Google Fonts
Números: font-variant-numeric: tabular-nums

## Cor do tenant
Cada campanha tem brand_color no banco. Aplicar no layout do [slug]:
<div style={{ '--tenant-color': campaign.brand_color } as React.CSSProperties}>
Isso propaga --accent automaticamente para todos os filhos.

## Copy (PT-BR)
- Tom direto, animado, humano
- CTA: verbo de ação ("Entrar no bolão", "Ver meu palpite")
- Erro: o que deu errado + como resolver ("Código inválido. Veja o Story da @larissa")
