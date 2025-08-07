let taxas = [];

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

    // Filtrar apenas os destinos possíveis a partir de MG
    const destinosMG = data
      .filter(item => item.uf_origem === 'MG')
      .map(item => item.uf_destino);

    const ufsDestinoUnicas = [...new Set(destinosMG)].sort();

    // Preencher o dropdown de destino
    ufsDestinoUnicas.forEach(uf => {
      const opt = document.createElement('option');
      opt.value = uf;
      opt.textContent = uf;
      destinoSelect.appendChild(opt);
    });
  })
  .catch(error => {
    console.error(error);
    erroMsg.textContent = 'Erro ao carregar dados. Tente recarregar a página.';
  });

// Limpar mensagens ao mudar seleção
destinoSelect.addEventListener('change', () => erroMsg.textContent = '');

// Evento de envio do formulário
document.getElementById('difal-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const origem = 'MG'; // Origem fixa
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

  const difal = Valor_Equipamento * (aliquotaInterna - aliquotaImportados);
  const precoFinal = Valor_Equipamento + difal;

  resultadoDiv.innerHTML = `
    <p><strong>DIFAL:</strong> R$ ${difal.toFixed(2).replace('.', ',')}</p>
    <p><strong>Preço Final:</strong> R$ ${precoFinal.toFixed(2).replace('.', ',')}</p>
  `;

  erroMsg.textContent = '';
});
