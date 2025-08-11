/**
 * Calculadora DIFAL — app.js (por dentro, importados por padrão)
 *
 * Campos: Equipamentos (#equipamento), Forma de Pagamento (#formaPagamento), UF Destino (#ufDestino)
 * Resultados: Valor DIFAL (#valorDifal), Valor Total (Equipamento + DIFAL) (#valorTotal)
 * Dados: data/valores-equipamentos.json, data/difal-rates.json
 * Premissas: Origem SEMPRE MG; Importados: usar aliquota_inter_importados quando disponível
 * Fórmula por dentro:
 *   ICMS_origem = Preço × ALQ_inter_aplicada
 *   Base_destino = (Preço − ICMS_origem) / (1 − ALQ_interna)
 *   ICMS_destino = Base_destino × ALQ_interna
 *   DIFAL = ICMS_destino − ICMS_origem
 */

(function () {
  "use strict";

  // =========================
  // Config
  // =========================
  const EQUIP_URL = "data/valores-equipamentos.json";
  const RATES_URL = "data/difal-rates.json";
  const ORIGEM_UF = "MG"; // fixo

  // =========================
  // Utils
  // =========================
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const pct = (v) => (v > 1 ? v / 100 : v); // aceita 18 -> 0.18; 0.18 permanece 0.18

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar ${url}: HTTP ${res.status}`);
    return res.json();
  }

  function clearChildren(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function setPlaceholder(selectEl, texto) {
    clearChildren(selectEl);
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = texto;
    opt.disabled = true;
    opt.selected = true;
    selectEl.appendChild(opt);
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

  // =========================
  // Indexadores
  // =========================
  function indexEquip(equipList) {
    const byEquip = new Map();
    for (const row of equipList) {
      const equip = row?.equipamento?.trim();
      const forma = row?.forma_pagamento?.trim();
      const valor = toNumberLike(row?.valor);
      if (!equip || !forma || !Number.isFinite(valor)) continue;

      if (!byEquip.has(equip)) byEquip.set(equip, { formas: new Set(), precos: {} });
      const ref = byEquip.get(equip);
      ref.formas.add(forma);
      ref.precos[forma] = valor;
    }

    const equipamentos = Array.from(byEquip.keys()).sort((a, b) => a.localeCompare(b, "pt-BR"));
    const ordemFormas = [
      "Valor à Vista",
      "Financiado (12x)",
      "Financiado (24x)",
      "Financiado (36x)",
      "Financiado (48x)",
    ];

    function getEquipamentos() { return equipamentos; }
    function getFormas(equip) {
      const ref = byEquip.get(equip);
      if (!ref) return [];
      const atuais = Array.from(ref.formas);
      const rank = (f) => {
        const i = ordemFormas.indexOf(f);
        return i === -1 ? 999 + atuais.indexOf(f) : i;
      };
      return atuais.sort((a, b) => rank(a) - rank(b));
    }
    function getPreco(equip, forma) {
      const v = byEquip.get(equip)?.precos?.[forma];
      return Number.isFinite(v) ? v : NaN;
    }

    return { getEquipamentos, getFormas, getPreco };
  }

  function indexRates(rateList) {
    const byPair = new Map();
    const ufsDestino = new Set();

    for (const r of rateList) {
      const o = String(r.uf_origem || "").toUpperCase();
      const d = String(r.uf_destino || "").toUpperCase();
      if (!o || !d) continue;
      if (o !== ORIGEM_UF) continue; // só indexamos origem MG

      ufsDestino.add(d);
      byPair.set(`${o}|${d}`, {
        interna: pct(toNumberLike(r.aliquota_interna_destino)),
        interes: pct(toNumberLike(r.aliquota_interestadual)),
        importados: pct(toNumberLike(r.aliquota_inter_importados)), // pode ser NaN se não houver
        icmsMin: toNumberLike(r.valor_icms_minimo) || 0,
      });
    }

    function getUFsDestino() { return Array.from(ufsDestino).sort(); }
    function getAliquotas(origem, destino) {
      return byPair.get(`${String(origem).toUpperCase()}|${String(destino).toUpperCase()}`) || null;
    }

    return { getUFsDestino, getAliquotas };
  }

  // =========================
  // DOM
  // =========================
  const selEquip = document.getElementById("equipamento");
  const selForma = document.getElementById("formaPagamento");
  const selUF = document.getElementById("ufDestino");
  const form = document.getElementById("form-difal");
  const btn = document.getElementById("btnCalcular");
  const outDifal = document.getElementById("valorDifal");
  const outTotal = document.getElementById("valorTotal");
  const erro = document.getElementById("erro");

  function setErro(msg) { erro.textContent = msg || ""; }
  function preencherSelect(select, items, placeholder) {
    setPlaceholder(select, placeholder);
    for (const it of items) {
      const opt = document.createElement("option");
      opt.value = it;
      opt.textContent = it;
      select.appendChild(opt);
    }
  }
  function resetResultados() { outDifal.textContent = "–"; outTotal.textContent = "–"; }

  // =========================
  // Boot
  // =========================
  let Equip = null;
  let Rates = null;

  async function init() {
    try {
      const [equipRaw, ratesRaw] = await Promise.all([fetchJSON(EQUIP_URL), fetchJSON(RATES_URL)]);
      Equip = indexEquip(equipRaw);
      Rates = indexRates(ratesRaw);

      preencherSelect(selEquip, Equip.getEquipamentos(), "Selecione o equipamento");
      preencherSelect(selUF, Rates.getUFsDestino(), "Selecione a UF de destino");

      selEquip.addEventListener("change", () => {
        const eq = selEquip.value;
        preencherSelect(selForma, Equip.getFormas(eq), "Selecione a forma de pagamento");
        resetResultados();
        setErro("");
      });

      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        calcular();
      });
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar dados. Verifique os arquivos 'valores-equipamentos.json' e 'difal-rates.json'.");
      if (btn) btn.disabled = true;
    }
  }

  // =========================
  // Cálculo (por dentro + importados)
  // =========================
  function calcular() {
    setErro("");

    const equip = selEquip.value;
    const forma = selForma.value;
    const ufDestino = selUF.value;

    if (!equip || !forma || !ufDestino) {
      setErro("Preencha todos os campos para calcular.");
      return;
    }

    const preco = Equip.getPreco(equip, forma);
    if (!Number.isFinite(preco)) {
      setErro("Preço não encontrado para a combinação selecionada.");
      return;
    }

    const a = Rates.getAliquotas(ORIGEM_UF, ufDestino);
    if (!a) { setErro("Alíquotas não encontradas para a UF selecionada."); return; }

    // Aplica SEMPRE a alíquota de importados quando disponível; senão, cai para a interestadual padrão
    const aliqInterAplicada = Number.isFinite(a.importados) ? a.importados : a.interes;

    if (!Number.isFinite(a.interna) || !Number.isFinite(aliqInterAplicada)) {
      setErro("Valores de alíquotas inválidos para a UF selecionada.");
      return;
    }

    const denom = 1 - a.interna; // sem FCP; se houver FCP, seria (1 - interna - fcp)
    if (denom <= 0) {
      setErro("Alíquota interna inválida (resultou em base negativa).");
      return;
    }

    const icmsOrigem = preco * aliqInterAplicada;
    const baseDestino = (preco - icmsOrigem) / denom;
    const icmsDestino = baseDestino * a.interna;

    let difal = icmsDestino - icmsOrigem;
    if (difal < 0) difal = 0;

    // Arredonda 2 casas
    const difalRound = Math.round(difal * 100) / 100;
    const total = preco + difalRound;

    outDifal.textContent = BRL.format(difalRound);
    outTotal.textContent = BRL.format(total);
  }

  // Inicializa
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
