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

    // Extrair todas as UFs únicas (tanto origem quanto destino)
    const ufsOrigem = new Set(data.map(item => item.uf_origem));
    const ufsDestino = new Set(data.map(item => item.uf_destino));
    const ufs = [...new Set([...ufsOrigem, ...ufsDestino])].sort();

    // Preencher os dropdowns
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

// Evento de envio do formulário (calcular DIFAL)
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

  let aliquotaInter = 0;
  let aliquotaInterna = 0;

  if (origem === destino) {
    // Se UF origem e destino forem iguais, alíquota interestadual é zero
    const taxaInterna = taxas.find(t => t.uf_origem === origem && t.uf_destino === destino);
    aliquotaInter = 0;
    aliquotaInterna = taxaInterna ? taxaInterna.aliquota_interna_destino : 0;
  } else {
    const taxa = taxas.find(t => t.uf_origem === origem && t.uf_destino === destino);
    if (!taxa) {
      erroMsg.textContent = 'Não foi possível encontrar alíquotas para o par de estados selecionado.';
      resultadoDiv.textContent = '';
      return;
    }
    aliquotaInter = taxa.aliquota_interestadual;
    aliquotaInterna = taxa.aliquota_interna_destino;
  }

  const difal = baseCalculo * ((aliquotaInterna - aliquotaInter) / 100);
  resultadoDiv.textContent = `DIFAL: R$ ${difal.toFixed(2).replace('.', ',')}`;
  erroMsg.textContent = '';
});
