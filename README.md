# Calculadora DIFAL (MG → UF destino)

Ferramenta leve (HTML/CSS/JS) para simular **DIFAL por dentro** e apoiar o comercial com **entradas e parcelamentos**. Publicado em GitHub Pages, sem dependências de build.

---

## ✨ O que a ferramenta faz
- **Entrada manual do “Valor à vista”** (evita divergências de planilha).
- **Cálculo do DIFAL por dentro**, considerando **alíquota de importados** quando houver.
- **MG → MG**: exibe nota e **DIFAL = 0**.
- **Cálculos adicionais**:
  - **Entrada 10%**
  - **Cartão/Plataforma**: `valor × 1,1111`
  - **Margem desconto Produto/Frete**: `3%`
  - **Menor entrada possível**: `entrada10 × 0,96`
- **Balões** 10%, 15%, 20%, 25%:
  - Entrada = % do valor à vista
  - Parcelas **36x** e **48x** via **PMT** (juros compostos **5% a.m.**) sobre o saldo.

---

## 🧮 Fórmulas principais

- **DIFAL por dentro**:
  - `ICMS_origem = PV × aliq_interestadual(ou importados)`
  - `Base_destino = (PV − ICMS_origem) / (1 − aliq_interna_destino)`
  - `ICMS_destino = Base_destino × aliq_interna_destino`
  - `DIFAL = (ICMS_destino − ICMS_origem)`

- **Balões (parcelas) – PMT**:
  - `saldo = PV − entrada`
  - `parcela = PMT(taxa=0,05; n=36|48; pv=saldo) = (pv×r) / (1−(1+r)^(−n))`

> **Observação:** alíquotas podem vir como **18** ou **0.18** (o app normaliza).

---

## 🗂️ Estrutura

```
/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ app.js
└─ data/
   ├─ difal-rates.json      # alíquotas
   └─ equipamentos.json     # nomes de equipamentos
```

### `data/equipamentos.json` (exemplo)
```json
{
  "equipamentos": [
    "Laser XYZ",
    "Ultrassom ABC",
    "Criolipólise 360",
    "HIFU Pro",
    "Radiofrequência Max"
  ]
}
```

> Linhas de seção são **filtradas** automaticamente: `1`, `ESTÉTICA`, `CONSTRUÇÃO`, `FITNESS`, `FOOD`.

### `data/difal-rates.json` (exemplo mínimo)
```json
[
  {
    "uf_origem": "MG",
    "uf_destino": "SP",
    "aliquota_interna_destino": 18,
    "aliquota_interestadual": 12,
    "aliquota_inter_importados": 4
  },
  {
    "uf_origem": "MG",
    "uf_destino": "RJ",
    "aliquota_interna_destino": 20,
    "aliquota_interestadual": 12,
    "aliquota_inter_importados": 4
  }
]
```

---

## 🔧 Configurações rápidas
Abra `js/app.js`:
- **Taxa de financiamento (PMT)**: `const FIN_RATE = 0.05` // 5% a.m.
- Percentuais dos **balões**: array `[10,15,20,25]` (ids mapeados).
- **Blacklist** de equipamentos (linhas de seção): `EQUIP_BLACKLIST`.

---

## ▶️ Rodando localmente
Requer apenas um servidor estático (para `fetch` funcionar):
```bash
python -m http.server 8080
# ou
npx serve -l 8080
```
Acesse: `http://localhost:8080`

---

## 🚀 Deploy (GitHub Pages)
- **Settings → Pages** → *Deploy from a branch* → `main` / **root**.
- Faça *cache bust* nos assets quando atualizar:
  ```html
  <link rel="stylesheet" href="css/styles.css?v=YYYYMMDDHH">
  <script src="js/app.js?v=YYYYMMDDHH"></script>
  ```

---

## 🧱 Tecnologias
- **HTML/CSS/JS** puro (bundle mínimo)
- **Intl.NumberFormat** para BRL
- **A11y**: `aria-live` para resultados; validação leve

---

## ✅ Principais mudanças (changelog resumido)
- **[Atual]** Entrada manual do valor à vista (removida dependência de planilha).
- Removido campo **Forma de pagamento** e “Entrada” como opção.
- Adicionados cálculos: **Cartão/Plataf. (×1,1111)**, **Margem 3%**, **Menor entrada (×0,96)**.
- **Balões** com parcelas via **PMT 5% a.m.** (36x/48x).
- Mantido DIFAL por dentro + alíquota de **importados** e regra **MG→MG = 0**.
- Removido campo **“Valor total (à vista + DIFAL)”**.
- UI refinada (paleta **amarelo/preto/branco**) e header bar.
- Lista de equipamentos migrou para `data/equipamentos.json` e filtragem de seções.

---

## 📸 (Opcional) Screenshots
Coloque imagens em `docs/` e referencie aqui.

---

## 📄 Licença
MIT — ajuste conforme política da empresa.
