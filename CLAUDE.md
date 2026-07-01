# Bolão Interativo — Instruções para Claude Code

## Stack
Next.js 14 App Router + TypeScript, Supabase (banco + auth + RLS), liquid-glass-react ^1.1.1, Tailwind CSS v3, Framer Motion, Resend

## Regras de segurança — NUNCA violar
- NUNCA expor SUPABASE_SERVICE_ROLE_KEY no client
- Validação do código de acesso SEMPRE server-side (API Route), nunca no frontend
- API Routes usam createServerClient() com service role para escrita
- Páginas públicas usam createBrowserClient() somente para leitura

## Arquitetura multi-tenant
- TODA query filtra por campaign_id ou tenant_id
- RLS ativo no Supabase — não desabilitar nunca
- Isolamento total: dados de um tenant nunca aparecem para outro

## Padrões de código
- Sem "any" no TypeScript — usar tipos de lib/supabase/types.ts
- "use client" obrigatório em componentes com hooks
- try/catch em todo await de banco ou API externa
- Tratamento de erro explícito em todas as API Routes

## Estrutura de pastas
- components/glass/ → GlassCard, GlassButton, GlassPanel
- lib/supabase/ → client.ts, server.ts, types.ts
- app/api/ → todas as API Routes (server-side)
- app/[slug]/ → fluxo público do participante
- app/admin/ → painel da agência (autenticado)
