document.getElementById('difal-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const origem = 'MG'; // Fixo
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
