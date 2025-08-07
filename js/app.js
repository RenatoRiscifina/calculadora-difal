let taxas = [];

const origemSelect = document.getElementById('estado-origem');
const destinoSelect = document.getElementById('estado-destino');
const erroMsg = document.getElementById('mensagem-erro');
const resultadoDiv = document.getElementById('resultado');

// Carrega o JSON ao abrir a página
fetch('data/difal-rates.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar o arquivo JSON');
    }
    return response.json();
  })
  .then(data => {
    taxas = data;

    // Extrair todas as UFs únicas
    const ufsOrigem = new Set(data.map(item => item.uf_origem));
    const ufsDestino = new Set(data.map(item => item.uf_destino));
    const ufs = [...new Set([...ufsOrigem, ...ufsDestino])].sort();

    // Preencher os dois dropdowns
    ufs.forEach(uf => {
      const opt1 = document.createElement('option');
      opt1.value = uf;
      opt1.textContent = uf;
      origemSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = uf;
      opt2.textContent = uf;
      destinoSelect.appendChild(opt2);
    });
  })
  .catch(error => {
    console.error(error);
    erroMsg.textContent = 'Erro ao carregar dados. Tente recarregar a página.';
  });

// Limpar mensagens ao mudar seleção
origemSelect.addEventListener('change', () => erroMsg.textContent = '');
destinoSelect.addEventListener('change', () => erroMsg.textContent = '');

// Evento de envio do formulário
document.getElementById('difal-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const origem = 'MG'; // fixo
  const destino = destinoSelect.value;
  const Valor_Equipamento = parseFloat(document.getElementById('base-calculo').value);

  if (!destino || isNaN(Valor_Equipamento) || Valor_Equipamento <= 0) {
    erroMsg.textContent = 'Selecione um estado de destino e insira um valor válido para o equipamento.';
    resultadoDiv.textContent = '';
    return;
  }

  const dados = taxas.find(t => t.uf_origem === origem && t.uf_destino === destino);

  if (!dados) {
    erroMsg.textContent = 'Não foi possível encontrar alíquotas para esse par de estados.';
    resultadoDiv.textContent = '';
    return;
  }

  const aliquotaInterna = dados.aliquota_interna_destino;
  const aliquotaImportados = dados.aliquota_inter_importados;

  // Novo cálculo com base na sua fórmula
  const numerador = Valor_Equipamento - (Valor_Equipamento * aliquotaImportados);
  const denominador = (1 - aliquotaInterna) * (aliquotaInterna - (Valor_Equipamento * aliquotaImportados));

  const difal = numerador / denominador;
  const precoFinal = Valor_Equipamento + difal;

  // Resultado
  resultadoDiv.innerHTML = `
    <p><strong>DIFAL:</strong> R$ ${difal.toFixed(2).replace('.', ',')}</p>
    <p><strong>Preço Final:</strong> R$ ${precoFinal.toFixed(2).replace('.', ',')}</p>
    <p><strong>Destino:</strong> ${destino}</p>
    <p><strong>Alíquota Interna:</strong> ${(aliquotaInterna * 100).toFixed(2)}%</p>
    <p><strong>Alíquota de Importados:</strong> ${(aliquotaImportados * 100).toFixed(2)}%</p>
  `;

  erroMsg.textContent = '';
});
