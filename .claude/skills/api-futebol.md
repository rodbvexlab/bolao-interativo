# Skill: Dados de Futebol — Copa 2026

## Produto: Bolão Híbrido
Dois tipos de palpite por participante:
1. Placar de cada jogo eliminatório (predictions)
2. Campeão, vice e terceiro (champion_predictions)

## Tabelas relevantes
- matches: jogos com stage = '16 avos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'
- predictions: palpite de placar por jogo (já existente)
- champion_predictions: palpite de campeão (nova tabela)

## Pontuação — predictions (trigger já ativo)
- Placar exato = 3pts
- Vencedor correto = 1pt
- Erro = 0pt

## Pontuação — champion_predictions (calcular na API Route do sorteio ou manualmente)
- Campeão correto = 5pts
- Vice correto = 3pts
- Terceiro correto = 2pts

## Jogos futuros
As oitavas, quartas, semis e final ainda não têm times definidos.
O admin insere as partidas pelo painel conforme os times se classificam.
A coluna eliminated=true sinaliza que o time saiu da Copa.

## Fluxo do participante
1. Preenche palpites nos jogos disponíveis (locked=false)
2. Escolhe campeão, vice e terceiro
3. Pontos acumulam automaticamente pelo trigger (jogos) + admin (campeão)
