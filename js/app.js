/**
 * Calculadora DIFAL — valor à vista digitável (sem planilha, PMT nas parcelas)
 * - Equipamento: apenas referência (lista local)
 * - UF destino: mantém DIFAL (origem MG)
 * - Infos extras: Entrada 10%, Cartão/Plataf. (×1,1111), Margem 3%, Menor entrada (×0,96 sobre a de 10%)
 * - Balões 10/15/20/25%: entrada = % do à vista; parcelas via PMT (5% a.m.) para 36x e 48x
 * - Filtra linhas de seção: 1, ESTÉTICA, CONSTRUÇÃO, FITNESS, FOOD
 */

(function () {
  "use strict";

  const EQUIP_LIST_URL = "data/equipamentos.json";
  const RATES_URL = "data/difal-rates.json";
  const ORIGEM_UF = "MG";
  const EQUIP_BLACKLIST = new Set(["1","ESTÉTICA","CONSTRUÇÃO","FITNESS","FOOD"]);

  // >>> taxa de financiamento (mês) usada no PMT
  const FIN_RATE = 0.05; // 5% a.m.

  // ===== Utils =====
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const pct = (v) => (v > 1 ? v / 100 : v);
  const toNumberLike = (n) => {
    if (typeof n === "number") return n;
    const s = String(n ?? "").trim(); if (!s) return NaN;
    return Number(s.replace(/R\$\s*/i,"").replace(/\./g,"").replace(",","."));
  };
  const parsePrecoInput = (el) => toNumberLike(el?.value);

  // PMT básico (fv=0, type=0): parcela positiva
  function pmt(rate, nper, pv) {
    if (!isFinite(rate) || !isFinite(nper) || !isFinite(pv) || nper <= 0) return NaN;
    if (rate === 0) return pv / nper;
    return (pv * rate) / (1 - Math.pow(1 + rate, -nper));
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    return res.json();
  }

  function normalizeEquipList(data) {
    const arr = Array.isArray(data) ? data : (Array.isArray(data?.equipamentos) ? data.equipamentos : []);
    const nomes = new Set();
    for (const raw of arr) {
      const nome = String(raw ?? "").trim();
      if (!nome) continue;
      if (EQUIP_BLACKLIST.has(nome.toUpperCase())) continue;
      nomes.add(nome);
    }
    return Array.from(nomes).sort((a,b)=>a.localeCompare(b,"pt-BR"));
  }

  function indexRates(rateList) {
    const byPair = new Map();
    const ufsDestino = new Set();
    for (const r of rateList) {
      const o = String(r.uf_origem||"").toUpperCase();
      const d = String(r.uf_destino||"").toUpperCase();
      if (!o || !d) continue;
      if (o !== ORIGEM_UF) continue;
      ufsDestino.add(d);
      byPair.set(`${o}|${d}`, {
        interna: pct(toNumberLike(r.aliquota_interna_destino)),
        interes: pct(toNumberLike(r.aliquota_interestadual)),
        importados: pct(toNumberLike(r.aliquota_inter_importados)),
      });
    }
    ufsDestino.add(ORIGEM_UF);
    return {
      getUFsDestino: () => Array.from(ufsDestino).sort(),
      getAliquotas: (origem, destino) => byPair.get(`${String(origem).toUpperCase()}|${String(destino).toUpperCase()}`) || null
    };
  }

  // ===== DOM =====
  const selEquip = document.getElementById("equipamento");
  const selUF    = document.getElementById("ufDestino");
  const form     = document.getElementById("form-difal");
  const btn      = document.getElementById("btnCalcular");
  const precoEl  = document.getElementById("precoInformado");

  const outVista = document.getElementById("valorEquipamento");
  const outDifal = document.getElementById("valorDifal");
  // const outTotal = document.getElementById("valorTotal");
  const nota     = document.getElementById("notaOperacao");
  const erro     = document.getElementById("erro");

  const rEntrada10     = document.getElementById("rEntrada10");
  const rCartao        = document.getElementById("rCartao");
  const rMargem        = document.getElementById("rMargem");
  const rMenorEntrada  = document.getElementById("rMenorEntrada");

  const idsBaloes = {
    10: { ent: "b10Entrada", p36: "b10P36", p48: "b10P48" },
    15: { ent: "b15Entrada", p36: "b15P36", p48: "b15P48" },
    20: { ent: "b20Entrada", p36: "b20P36", p48: "b20P48" },
    25: { ent: "b25Entrada", p36: "b25P36", p48: "b25P48" },
  };
  const get = (id)=>document.getElementById(id);

  function setErro(msg){ if(erro) erro.textContent = msg||""; }
  function setNota(msg){ if(nota) nota.textContent = msg||""; }
  function preencherSelect(select, items, placeholder){
    select.innerHTML = "";
    const opt = document.createElement("option");
    opt.value=""; opt.textContent = placeholder; opt.disabled = true; opt.selected = true;
    select.appendChild(opt);
    for(const v of items){
      const o=document.createElement("option"); o.value=v; o.textContent=v; select.appendChild(o);
    }
  }
  function resetResultados(){
    if(outVista) outVista.textContent = "–";
    if(outDifal) outDifal.textContent = "–";
    // if(outTotal) outTotal.textContent = "–";
    if(rEntrada10)    rEntrada10.textContent = "–";
    if(rCartao)       rCartao.textContent = "–";
    if(rMargem)       rMargem.textContent = "–";
    if(rMenorEntrada) rMenorEntrada.textContent = "–";
    for (const k of Object.keys(idsBaloes)){
      const m = idsBaloes[k];
      get(m.ent).textContent = "–";
      get(m.p36).textContent = "–";
      get(m.p48).textContent = "–";
    }
    setNota("");
  }

  // ===== Estado =====
  let Rates = null;

  async function init(){
    try{
      const [equipData, ratesRaw] = await Promise.all([
        fetchJSON(EQUIP_LIST_URL),
        fetchJSON(RATES_URL),
      ]);

      const nomes = normalizeEquipList(equipData);
      Rates = indexRates(ratesRaw);

      preencherSelect(selEquip, nomes, "Selecione o equipamento");
      preencherSelect(selUF, Rates.getUFsDestino(), "Selecione a UF de destino");

      selEquip.addEventListener("change", () => { resetResultados(); setErro(""); });

      form.addEventListener("submit", (ev)=>{
        ev.preventDefault();
        calcular();
      });
    }catch(e){
      console.error(e);
      setErro("Falha ao carregar dados iniciais. Verifique 'data/equipamentos.json' e 'data/difal-rates.json'.");
      if(btn) btn.disabled = true;
    }
  }

  function calcular(){
    setErro(""); setNota("");

    const equip = selEquip.value;
    const ufDestino = selUF.value;
    const vista = parsePrecoInput(precoEl);

    if(!equip || !ufDestino){ setErro("Selecione o equipamento e a UF de destino."); return; }
    if(!Number.isFinite(vista) || vista <= 0){ setErro("Informe um valor à vista válido."); precoEl?.focus(); return; }

    if(outVista) outVista.textContent = BRL.format(vista);

    // ===== Infos básicas
    const entrada10 = vista * 0.20;
    const cartao    = vista * 1.1111;
    const margem    = vista * 0.03;
    const menorEnt  = entrada10 * 0.96;

    rEntrada10.textContent = BRL.format(entrada10);
    rCartao.textContent    = BRL.format(cartao);
    rMargem.textContent    = BRL.format(margem);
    rMenorEntrada.textContent = BRL.format(menorEnt);

    // ===== Balões com PMT (5% a.m.) =====
    for (const p of [10,15,20,25]) {
      const entrada = vista * (p/100);
      const saldo = Math.max(vista - entrada, 0);
      const parcela36 = pmt(FIN_RATE, 36, saldo);
      const parcela48 = pmt(FIN_RATE, 48, saldo);

      get(idsBaloes[p].ent).textContent = BRL.format(entrada);
      get(idsBaloes[p].p36).textContent = BRL.format(parcela36);
      get(idsBaloes[p].p48).textContent = BRL.format(parcela48);
    }

    // ===== DIFAL =====
    if (String(ufDestino).toUpperCase() === ORIGEM_UF) {
      setNota("Operação interna (MG→MG): DIFAL não se aplica.");
      outDifal.textContent = BRL.format(0);
     //  outTotal.textContent = BRL.format(vista);
      return;
    }
    const a = Rates.getAliquotas(ORIGEM_UF, ufDestino);
    if(!a){ setErro("Alíquotas não encontradas para a UF selecionada."); return; }
    const aliqInterAplicada = Number.isFinite(a.importados) ? a.importados : a.interes;
    if(!Number.isFinite(a.interna) || !Number.isFinite(aliqInterAplicada)){
      setErro("Alíquotas inválidas."); return;
    }

    const denom = 1 - a.interna;
    if(denom <= 0){ setErro("Alíquota interna inválida."); return; }

    const icmsOrigem  = vista * aliqInterAplicada;
    const baseDestino = (vista - icmsOrigem) / denom;
    const icmsDestino = baseDestino * a.interna;

    let difal = icmsDestino - icmsOrigem;
    if (difal < 0) difal = 0;

    const difalRound = Math.round(difal * 100) / 100;
    outDifal.textContent = BRL.format(difalRound);
    // outTotal.textContent = BRL.format(vista + difalRound);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();
