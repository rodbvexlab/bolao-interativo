# Skill: Dados de Futebol — Copa 2026

## Produto: Bolão Híbrido
Dois tipos de palpite por participante:
1. Placar de cada jogo eliminatório (predictions)
2. Campeão, vice e terceiro (champion_predictions)

## Tabelas relevantes
- matches: jogos com stage = '16 avos', 'Oitavas', 'Quartas', 'Semifinal', '3º Lugar', 'Final'
- predictions: palpite de placar por jogo (já existente)
- champion_predictions: palpite de campeão (nova tabela)

## Pontuação — predictions (trigger calculate_match_points, já ativo)
- Placar exato = 3pts
- Vencedor correto = 1pt
- Erro = 0pt

## Pontuação — champion_predictions (100% automática, mesmo trigger calculate_match_points)
- Campeão correto = 5pts
- Vice correto = 3pts
- Terceiro correto = 2pts

Disparada quando o admin salva o resultado da partida `Final` (define campeão + vice) ou
`3º Lugar` (define terceiro). O cálculo é idempotente e funciona em qualquer ordem — se o
3º Lugar for resolvido antes da Final (comum, pois acontece um dia antes na Copa real), o
trigger aplica os 2pts do terceiro assim que possível e completa campeão/vice quando a
Final for resolvida, sem sobrescrever o que já foi calculado.

**Regra importante:** Final e 3º Lugar não podem terminar empatados no banco — o schema não
guarda placar de pênaltis separado. O admin deve informar o resultado já refletindo quem
venceu (ex: se foi pênaltis, ajustar o placar para não empatar). Tentar salvar um empate
nessas duas fases retorna erro 400 explicando isso.

`participants.points` é sempre recalculado como `SUM(predictions.points_earned) +
champion_predictions.points_earned` — fórmula única, roda em toda resolução de partida,
nunca fica dessincronizada mesmo com múltiplos jogos sendo resolvidos ao longo do torneio.

## Jogos futuros
As oitavas, quartas, semis, 3º lugar e final ainda não têm times definidos.
O admin insere as partidas pelo painel conforme os times se classificam.
A coluna eliminated=true sinaliza que o time saiu da Copa.

## Fluxo do participante
1. Preenche palpites nos jogos disponíveis (locked=false)
2. Escolhe campeão, vice e terceiro
3. Pontos acumulam 100% automaticamente pelo trigger — nenhuma ação manual do admin além de
   inserir os resultados das partidas
