let taxas = [];
let precos = [];

const equipamentoSelect = document.getElementById('equipamento');
const pagamentoSelect = document.getElementById('pagamento');
const valorExibicao = document.getElementById('valor-equipamento');
const destinoSelect = document.getElementById('destino');
const erroMsg = document.getElementById('erro');
const resultadoDiv = document.getElementById('resultado');

// 1. Carregar os JSONs de alíquotas e preços
Promise.all([
  fetch('data/difal-rates.json').then(res => res.json()),
  fetch('data/valores-equipamentos.json').then(res => res.json())
])
.then(([dadosAliquotas, dadosPrecos]) => {
  taxas = dadosAliquotas;
  precos = dadosPrecos;

  // Preencher dropdown de equipamentos
  const equipamentosUnicos = [...new Set(precos.map(p => p.equipamento))].sort();
  equipamentosUnicos.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    equipamentoSelect.appendChild(opt);
  });

  // Preencher dropdown de destinos (MG origem fixa)
  const destinosTG = [...new Set(
    taxas.filter(t => t.uf_origem === 'MG').map(t => t.uf_destino)
  )].sort();
  destinosTG.forEach(uf => {
    const opt = document.createElement('option');
    opt.value = uf;
    opt.textContent = uf;
    destinoSelect.appendChild(opt);
  });
})
.catch(err => {
  console.error(err);
  erroMsg.textContent = 'Erro ao carregar dados. Tente recarregar a página.';
});

// 2. Quando o equipamento muda, carregar as formas de pagamento
equipamentoSelect.addEventListener('change', () => {
  pagamentoSelect.innerHTML = '<option value="">Selecione a forma de pagamento</option>';
  valorExibicao.textContent = '';
  erroMsg.textContent = '';

  const eqSelecionado = equipamentoSelect.value;
  if (!eqSelecionado) return;

  const formas = precos
    .filter(p => p.equipamento === eqSelecionado)
    .map(p => p.forma_pagamento);

  [...new Set(formas)].forEach(fp => {
    const opt = document.createElement('option');
    opt.value = fp;
    opt.textContent = fp;
    pagamentoSelect.appendChild(opt);
  });
});

// 3. Quando a forma de pagamento muda, mostrar valor selecionado
pagamentoSelect.addEventListener('change', () => {
  valorExibicao.textContent = '';
  erroMsg.textContent = '';

  const eq = equipamentoSelect.value;
  const fp = pagamentoSelect.value;
  if (!eq || !fp) return;

  const precoObj = precos.find(p => p.equipamento === eq && p.forma_pagamento === fp);
  if (precoObj) {
    valorExibicao.textContent = `Valor do equipamento: R$ ${precoObj.valor.toFixed(2).replace('.', ',')}`;
  }
});

// 4. Ao submeter o formulário, calcular DIFAL e preço final
document.getElementById('difal-form').addEventListener('submit', function(e) {
  e.preventDefault();
  erroMsg.textContent = '';
  resultadoDiv.textContent = '';

  const eq = equipamentoSelect.value;
  const fp = pagamentoSelect.value;
  const origem = 'MG'; // origem fixa
  const destino = destinoSelect.value;

  if (!eq || !fp || !destino) {
    erroMsg.textContent = 'Por favor selecione equipamento, forma de pagamento e destino.';
    return;
  }

  const precoObj = precos.find(p => p.equipamento === eq && p.forma_pagamento === fp);
  if (!precoObj) {
    erroMsg.textContent = 'Não foi possível encontrar o valor do equipamento.';
    return;
  }

  const Valor_Equipamento = precoObj.valor;

  const aliquotaData = taxas.find(t => t.uf_origem === origem && t.uf_destino === destino);
  if (!aliquotaData) {
    erroMsg.textContent = 'Não foi possível encontrar as alíquotas para esse destino.';
    return;
  }

  const aliquotaInterna = aliquotaData.aliquota_interna_destino;
  const aliquotaImportados = aliquotaData.aliquota_inter_importados;

  const difal = Valor_Equipamento * (aliquotaInterna - aliquotaImportados);
  const precoFinal = Valor_Equipamento + difal;

  resultadoDiv.innerHTML = `
    <p><strong>DIFAL:</strong> R$ ${difal.toFixed(2).replace('.', ',')}</p>
    <p><strong>Preço Final:</strong> R$ ${precoFinal.toFixed(2).replace('.', ',')}</p>
  `;
});
