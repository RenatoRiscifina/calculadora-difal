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

  const origem = origemSelect.value;
  const destino = destinoSelect.value;
  const baseCalculo = parseFloat(document.getElementById('base-calculo').value);

  if (!origem || !destino || isNaN(baseCalculo) || baseCalculo <= 0) {
    erroMsg.textContent = 'Preencha todos os campos corretamente. O valor da base de cálculo deve ser maior que zero.';
    resultadoDiv.textContent = '';
    return;
  }

  const dados = taxas.find(t => t.uf_origem === origem && t.uf_destino === destino);

  if (!dados) {
    erroMsg.textContent = 'Não foi possível encontrar alíquotas para o par de estados selecionado.';
    resultadoDiv.textContent = '';
    return;
  }

  const {
    aliquota_interestadual,
    aliquota_interna_destino,
    aliquota_inter_importados,
    valor_icms_minimo
  } = dados;

  // Se for o mesmo estado, a alíquota interestadual é zero
  const aliqInter = origem === destino ? 0 : aliquota_interestadual;

  const aliquotaInterna = aliquota_interna_destino;
const aliquotaImportados = aliquota_inter_importados;

const numerador = baseCalculo * aliquotaImportados;
const denominador = 1 - aliquotaInterna;

const icmsDestino = ((baseCalculo - (numerador / denominador)) * aliquotaInterna);
const icmsOrigem = baseCalculo * aliquotaImportados;

const difal = icmsDestino - icmsOrigem;


  // Exibe todos os dados relevantes
  resultadoDiv.innerHTML = `
  <p><strong>DIFAL:</strong> R$ ${difal.toFixed(2).replace('.', ',')}</p>
  <p><strong>ICMS Destino:</strong> R$ ${icmsDestino.toFixed(2).replace('.', ',')}</p>
  <p><strong>ICMS Origem (Importados):</strong> R$ ${icmsOrigem.toFixed(2).replace('.', ',')}</p>
  <p><strong>Alíquota Interna (destino):</strong> ${(aliquotaInterna * 100).toFixed(2)}%</p>
  <p><strong>Alíquota p/ Importados (origem):</strong> ${(aliquotaImportados * 100).toFixed(2)}%</p>
`;

  erroMsg.textContent = '';
});
