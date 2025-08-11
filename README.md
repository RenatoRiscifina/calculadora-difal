## Calculadora DIFAL · Blips

Aplicação web (HTML/CSS/JS) para cálculo de DIFAL com origem fixa em MG, usando duas bases JSON:

data/valores-equipamentos.json: preços por equipamento × forma de pagamento

data/difal-rates.json: alíquotas por UF de destino (interna, interestadual e interestadual para importados)

Interface com paleta amarelo / preto / branco, alto contraste e foco em acessibilidade.

## Objetivo do projeto

Entregar uma calculadora simples e confiável de DIFAL para produtos importados, que:

carregue dados estáticos (preços e alíquotas) via JSON,

ofereça uma UI direta (3 campos + 3 resultados),

aplique a fórmula “por dentro” com a interestadual de importados quando existir.

## Funcionalidades

1. Campos:

Equipamentos

Forma de Pagamento

UF Destino

2. Resultados:

Valor do equipamento (selecionado)

Valor DIFAL

Valor total (Equipamento + DIFAL)

Origem sempre MG.

3. Para importados, usa aliquota_inter_importados; se ausente, cai para a aliquota_interestadual.

Formatação BRL com Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).

UI responsiva, com foco visível e contraste alto.

## Publicar no GitHub Pages

1. Commit/push na branch main.

2. Settings → Pages → Deploy from a branch.

3. Selecione main e a pasta /root.

4. Aguarde o deploy e acesse a URL do Pages.

Como os caminhos de fetch() são relativos ao index.html (data/...), não há configurações extras.

## Processo de construção (passo a passo)

1. Definição do contrato de dados

Preços separados por equipamento × forma de pagamento.

Alíquotas por par UF (origem MG) → UF destino, com campos aliquota_interna_destino, aliquota_interestadual, aliquota_inter_importados.

2. Indexação em memória

Equipamentos: mapeamos equip → {formas, preços} para buscar rápido as formas e o valor.

Alíquotas: mapeamos MG|UF → objeto com as alíquotas, e uma lista única de UFs de destino.

3. UI e binding

Preenchemos o select de equipamentos na carga.

Ao escolher o equipamento, carregamos as formas de pagamento válidas.

Preenchemos as UFs de destino a partir das alíquotas indexadas.

Exibimos o valor do equipamento quando a forma é selecionada.

4. Cálculo “por dentro” (gross-up) para importados

ICMS_origem = Preço × ALQ_inter_aplicada
(ALQ_inter_aplicada = aliquota_inter_importados se existir; senão, aliquota_interestadual)

Base_destino = (Preço − ICMS_origem) / (1 − ALQ_interna)

ICMS_destino = Base_destino × ALQ_interna

DIFAL = ICMS_destino − ICMS_origem (se negativo, zera)

Total = Preço + DIFAL

5. Qualidade e UX

Placeholders corretos, campos required, mensagens de erro claras.

Arredondamento apenas no final (2 casas) para evitar ruído de ponto flutuante.

Acessibilidade: aria-live nos resultados, foco visível, contraste alto.

CSS com design tokens (variáveis CSS) e componentes simples (cards, botões, listas).

## Técnicas e tecnologias usadas

1. Vanilla JS (sem framework):

fetch com cache: "no-store" para evitar cache “duro” no Pages.

Indexação com Map, Set e funções utilitárias puras.

2. Formatação e parsing:

Normalização numérica tolerante (18 ↔ 0.18 ↔ “18%”), sem dependências externas.

3. Acessibilidade/UX:

aria-live nos resultados, foco visível (:focus-visible), semântica básica.

4. CSS moderno:

Variáveis CSS (tema), sombras, responsividade, redução de movimento (prefers-reduced-motion).

5. Arquitetura simples e clara:

Dados (/data) separados do código (/js) e estilos (/css).

app.js dividido em Config, Utils, Indexadores, Binding, Cálculo.

## Detalhes do cálculo (exemplo)
Preço (após selecionar equipamento + forma): R$ 24.000,00

Alíquota interna (destino): 18%

Interestadual importados: 4%

ICMS_origem = 24.000 × 0,04 = 960,00

Base_destino = (24.000 − 960) / (1 − 0,18) = 23.040 / 0,82

ICMS_destino = Base_destino × 0,18

DIFAL = ICMS_destino − 960,00

Total = Preço + DIFAL

## Decisões de design

Dados fora do código: facilita atualização sem redeploy de JS/CSS.

Indexação: performance e simplicidade (lookups O(1)).

Cálculo isolado: fácil de trocar ou expandir (ex.: incluir FCP).

Sem dependências: zero build; ideal para GitHub Pages e manutenção rápida.

Tema consistente: tokens CSS e componentes reutilizáveis.

## Boas práticas adotadas

Código segmentado por responsabilidade (utils, indexação, cálculo).

Nomes autoexplicativos e comentários concisos.

Placeholders e required nos campos, validações de entrada e mensagens de erro.

Arredondamento apenas no fim do fluxo de cálculo.

Caminhos relativos estáveis para publicar em qualquer domínio (Pages).

## Testes e validação (sugestão)

Unitários dos indexadores (equip/rates): garantir contratos ao trocar JSON.

Casos de borda:

Alíquota interna igual/menor que a interestadual (DIFAL = 0).

Ausência de aliquota_inter_importados (fallback para aliquota_interestadual).

Valores de preço inválidos ou strings com pontuação/BRL.

Comparação com planilhas: validar 3–5 cenários por UF.

## Contribuindo

1. Faça um fork.

2. Crie uma branch: git checkout -b feat/minha-feature.

3. Commits no padrão: feat: …, fix: …, docs: ….

4. git push e abra um PR.