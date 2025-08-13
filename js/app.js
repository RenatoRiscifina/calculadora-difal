/**
 * Calculadora DIFAL — app.js
 * Preços: Google Apps Script (JSON) — URL /exec abaixo
 * Alíquotas: data/difal-rates.json
 * Regras: cálculo "por dentro", usa alíquota de importados quando houver, MG→MG = DIFAL 0 + nota
 * Extras: "Entrada" NÃO é forma de pagamento; exibimos como campo informativo nos resultados
 *         Filtra equipamentos-cabeçalho e sem valores (1, ESTÉTICA, CONSTRUÇÃO, FITNESS, FOOD)
 */

(function () {
  "use strict";

  // === Config ===
  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyWkHpO41Lw1RHgABygPoMWJoE3ezt0M5R3Zcyhf46pQBprU-gHWa9H3PacgijSoWyW/exec";
  const RATES_URL = "data/difal-rates.json";
  const ORIGEM_UF = "MG"; // fixo

  // Equipamentos a excluir do select (linhas de seção/cabeçalho)
  const EQUIP_BLACKLIST = new Set(["1", "ESTÉTICA", "CONSTRUÇÃO", "FITNESS", "FOOD"]);

  // === Utils ===
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const pct = (v) => (v > 1 ? v / 100 : v); // 18 -> 0.18; 0.18 mantém

  function withOrigin(url) {
    const hasQ = url.includes("?");
    return url + (hasQ ? "&" : "?") + "origin=" + encodeURIComponent(location.origin);
  }

  async function fetchJSON(url, { strictJson = false } = {}) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ao carregar ${url}`);
    if (strictJson) {
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("application/json")) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Conteúdo não-JSON em ${url}. Trecho: ${String(txt).slice(0, 200)}`);
      }
    }
    return res.json();
  }

  function toNumberLike(n) {
    if (typeof n === "number") return n;
    if (n == null) return NaN;
    const s = String(n).trim();
    if (!s) return NaN;
    const norm = s.replace(/R\$\s*/i, "").replace(/\./g, "").replace(",", ".");
    const v = Number(norm);
    return Number.isFinite(v) ? v : NaN;
  }

  // === Indexadores ===
  // Recebe items do Apps Script: [{ equipamento, forma_pagamento, valor }]
  // Guarda "Entrada" separada (ref.entrada) e não inclui nas formas selecionáveis
  function indexEquip(equipList) {
    const byEquip = new Map();

    for (const row of equipList) {
      const equipRaw = row?.equipamento ?? "";
      const equip = String(equipRaw).trim();
      if (!equip) continue;

      // pula cabeçalhos/linhas-seção
      if (EQUIP_BLACKLIST.has(equip.toUpperCase())) continue;

      const formaRaw = row?.forma_pagamento ?? "";
      const forma = String(formaRaw).trim();
      const valor = toNumberLike(row?.valor);

      if (!byEquip.has(equip)) byEquip.set(equip, { formas: new Set(), precos: {}, entrada: NaN });

      const ref = byEquip.get(equip);

      // Entrada: guarda separado e NÃO adiciona às formas
      if (/^entrada$/i.test(forma)) {
        if (Number.isFinite(valor)) ref.entrada = valor;
        continue;
      }

      // Outras formas válidas
      if (!forma || !Number.isFinite(valor)) continue;
      ref.formas.add(forma);
      ref.precos[forma] = valor;
    }

    // Apenas equipamentos com pelo menos uma forma de pagamento válida (sem contar "Entrada")
    const equipamentos = Array.from(byEquip.entries())
      .filter(([, ref]) => ref.formas.size > 0)
      .map(([nome]) => nome)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));

    // ordem desejada (sem "Entrada")
    const ordemFormas = [
      "Valor à Vista",
      "Financiado (12x)",
      "Financiado (24x)",
      "Financiado (36x)",
      "Financiado (48x)",
    ];

    function getEquipamentos() { return equipamentos; }
    function getFormas(equip) {
      const ref = byEquip.get(equip); if (!ref) return [];
      const atuais = Array.from(ref.formas);
      const rank = (f) => { const i = ordemFormas.indexOf(f); return i === -1 ? 999 + atuais.indexOf(f) : i; };
      return atuais.sort((a, b) => rank(a) - rank(b));
    }
    function getPreco(equip, forma) {
      const v = byEquip.get(equip)?.precos?.[forma];
      return Number.isFinite(v) ? v : NaN;
    }
    function getEntrada(equip) {
      const v = byEquip.get(equip)?.entrada;
      return Number.isFinite(v) ? v : NaN;
    }

    return { getEquipamentos, getFormas, getPreco, getEntrada };
  }

  function indexRates(rateList) {
    const byPair = new Map();
    const ufsDestino = new Set();
    for (const r of rateList) {
      const o = String(r.uf_origem || "").toUpperCase();
      const d = String(r.uf_destino || "").toUpperCase();
      if (!o || !d) continue;
      if (o !== ORIGEM_UF) continue; // só MG
      ufsDestino.add(d);
      byPair.set(`${o}|${d}`, {
        interna: pct(toNumberLike(r.aliquota_interna_destino)),
        interes: pct(toNumberLike(r.aliquota_interestadual)),
        importados: pct(toNumberLike(r.aliquota_inter_importados)),
      });
    }
    // Garante MG no select, mesmo sem linha MG|MG
    ufsDestino.add(ORIGEM_UF);

    function getUFsDestino() { return Array.from(ufsDestino).sort(); }
    function getAliquotas(origem, destino) {
      return byPair.get(`${String(origem).toUpperCase()}|${String(destino).toUpperCase()}`) || null;
    }
    return { getUFsDestino, getAliquotas };
  }

  // === DOM ===
  const selEquip = document.getElementById("equipamento");
  const selForma = document.getElementById("formaPagamento");
  const selUF = document.getElementById("ufDestino");
  const form = document.getElementById("form-difal");
  const btn = document.getElementById("btnCalcular");
  const outBase = document.getElementById("valorEquipamento");
  const outEntrada = document.getElementById("valorEntrada");
  const outDifal = document.getElementById("valorDifal");
  const outTotal = document.getElementById("valorTotal");
  const erro = document.getElementById("erro");
  const nota = document.getElementById("notaOperacao");

  function setErro(msg) { if (erro) erro.textContent = msg || ""; }
  function setNota(msg) { if (nota) nota.textContent = msg || ""; }

  function clearChildren(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }
  function setPlaceholder(selectEl, texto) {
    clearChildren(selectEl);
    const opt = document.createElement("option");
    opt.value = ""; opt.textContent = texto; opt.disabled = true; opt.selected = true;
    selectEl.appendChild(opt);
  }
  function preencherSelect(select, items, placeholder) {
    setPlaceholder(select, placeholder);
    for (const it of items) {
      const opt = document.createElement("option");
      opt.value = it; opt.textContent = it;
      select.appendChild(opt);
    }
  }
  function resetResultados() {
    if (outDifal) outDifal.textContent = "–";
    if (outTotal) outTotal.textContent = "–";
    setNota("");
  }

  // === Boot ===
  let Equip = null, Rates = null;

  async function init() {
    try {
      // Preços (Apps Script) + Alíquotas locais
      const [equipRaw, ratesRaw] = await Promise.all([
        fetchJSON(withOrigin(SHEET_API_URL), { strictJson: true }),
        fetchJSON(RATES_URL, { strictJson: false }),
      ]);

      Equip = indexEquip(equipRaw.items ? equipRaw.items : equipRaw);
      Rates = indexRates(ratesRaw);

      preencherSelect(selEquip, Equip.getEquipamentos(), "Selecione o equipamento");
      preencherSelect(selUF, Rates.getUFsDestino(), "Selecione a UF de destino");

      selEquip.addEventListener("change", () => {
        const eq = selEquip.value;

        // Preenche formas (sem "Entrada")
        preencherSelect(selForma, Equip.getFormas(eq), "Selecione a forma de pagamento");

        // Atualiza valor de ENTRADA imediatamente ao escolher o equipamento
        const entrada = Equip.getEntrada(eq);
        if (outEntrada) outEntrada.textContent = Number.isFinite(entrada) ? BRL.format(entrada) : "–";

        // Limpa base/DIFAL/Total até escolher a forma
        if (outBase) outBase.textContent = "–";
        resetResultados();
        setErro("");
      });

      selForma.addEventListener("change", () => {
        const eq = selEquip.value, f = selForma.value;
        const base = Equip.getPreco(eq, f);
        if (outBase) outBase.textContent = Number.isFinite(base) ? BRL.format(base) : "–";
        resetResultados();
        setErro("");
      });

      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        calcular();
      });
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar dados. Verifique o Web App do Sheets e o arquivo 'data/difal-rates.json'.");
      if (btn) btn.disabled = true;
    }
  }

  // === Cálculo (por dentro + importados + MG→MG = 0) ===
  function calcular() {
    setErro(""); setNota("");

    const equip = selEquip.value;
    const forma = selForma.value;
    const ufDestino = selUF.value;

    if (!equip || !forma || !ufDestino) { setErro("Preencha todos os campos para calcular."); return; }

    const preco = Equip.getPreco(equip, forma);
    if (!Number.isFinite(preco)) { setErro("Preço não encontrado para a combinação selecionada."); return; }
    if (outBase) outBase.textContent = BRL.format(preco);

    // Caso interno MG→MG: DIFAL não se aplica
    if (String(ufDestino).toUpperCase() === ORIGEM_UF) {
      setNota("Operação interna (MG→MG): DIFAL não se aplica.");
      if (outDifal) outDifal.textContent = BRL.format(0);
      if (outTotal) outTotal.textContent = BRL.format(preco);
      return;
    }

    const a = Rates.getAliquotas(ORIGEM_UF, ufDestino);
    if (!a) { setErro("Alíquotas não encontradas para a UF selecionada."); return; }

    const aliqInterAplicada = Number.isFinite(a.importados) ? a.importados : a.interes;
    if (!Number.isFinite(a.interna) || !Number.isFinite(aliqInterAplicada)) {
      setErro("Valores de alíquotas inválidos para a UF selecionada."); return;
    }

    const denom = 1 - a.interna; // sem FCP; se houver, seria (1 - interna - fcp)
    if (denom <= 0) { setErro("Alíquota interna inválida (resultou em base negativa)."); return; }

    const icmsOrigem = preco * aliqInterAplicada;
    const baseDestino = (preco - icmsOrigem) / denom;
    const icmsDestino = baseDestino * a.interna;

    let difal = icmsDestino - icmsOrigem;
    if (difal < 0) difal = 0;

    const difalRound = Math.round(difal * 100) / 100;
    const total = preco + difalRound;

    if (outDifal) outDifal.textContent = BRL.format(difalRound);
    if (outTotal) outTotal.textContent = BRL.format(total);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();
