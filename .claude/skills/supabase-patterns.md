# Skill: Supabase Patterns

## Client browser (leitura pública)
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

## Client server (API Routes — escrita)
import { createServerClient } from '@supabase/ssr'
export function createServerSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => undefined, set: () => {}, remove: () => {} } }
  )
}

## Regra multi-tenant obrigatória
TODA query de participants e predictions filtra por campaign_id.
Nunca fazer select sem filtro de tenant.

## Verificar duplicata antes de insert
Usar .maybeSingle() — retorna null sem erro se não encontrar.

## Tipos
Sempre importar de @/lib/supabase/types gerado pelo CLI.

## Tabela champion_predictions
Consulta do palpite de campeão por participante:

```typescript
const { data } = await supabase
  .from('champion_predictions')
  .select('champion, runner_up, third_place, points_earned')
  .eq('participant_id', participantId)
  .eq('campaign_id', campaignId)
  .maybeSingle()
```

Insert do palpite de campeão:

```typescript
await supabase
  .from('champion_predictions')
  .upsert({
    participant_id: participantId,
    campaign_id: campaignId,
    champion,
    runner_up,
    third_place
  }, { onConflict: 'participant_id,campaign_id' })
```
