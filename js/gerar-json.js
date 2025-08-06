const fs = require('fs');

const rawData = `
UF;ALIQ_INTERNA;ALIQ_INTERESTADUAL
AC;0.19;0.07
AL;0.19;0.07
AM;0.20;0.07
AP;0.18;0.07
BA;0.19;0.07
CE;0.18;0.07
DF;0.18;0.07
ES;0.17;0.07
GO;0.17;0.07
MA;0.20;0.07
MT;0.17;0.07
MS;0.17;0.07
MG;0.18;0.07
PA;0.19;0.07
PB;0.18;0.07
PR;0.19;0.12
PE;0.18;0.07
PI;0.21;0.07
RN;0.20;0.07
RS;0.17;0.12
RJ;0.20;0.12
RO;0.18;0.07
RR;0.20;0.07
SC;0.17;0.12
SP;0.18;0.12
SE;0.22;0.07
TO;0.20;0.07
`;

const estados = rawData.trim().split('\n').slice(1).map(line => {
  const [uf, interna, interestadual] = line.split(';');
  return {
    uf: uf.trim(),
    aliquota_interna: parseFloat(interna.replace(',', '.')),
    aliquota_interestadual: parseFloat(interestadual.replace(',', '.'))
  };
});

const result = [];

estados.forEach(origem => {
  estados.forEach(destino => {
    if (origem.uf !== destino.uf) {
      result.push({
        uf_origem: origem.uf,
        uf_destino: destino.uf,
        aliquota_interestadual: origem.aliquota_interestadual,
        aliquota_interna_destino: destino.aliquota_interna
      });
    }
  });
});

fs.writeFileSync('data/difal-rates.json', JSON.stringify(result, null, 2), 'utf-8');

console.log(`Arquivo gerado com ${result.length} combinações.`);
