const fs = require('fs');

const rawData = `
UF;ALIQ_INTERNA;ALIQ_INTERESTADUAL;ALIQ_INTEREST_IMPORTADOS;VLRICMS
AC;0,19;0,07;0,04;960,00
AL;0,19;0,07;0,04;960,00
AM;0,20;0,07;0,04;960,00
AP;0,18;0,07;0,04;960,00
BA;0,19;0,07;0,04;960,00
CE;0,18;0,07;0,04;960,00
DF;0,18;0,07;0,04;960,00
ES;0,17;0,07;0,04;960,00
GO;0,17;0,07;0,04;960,00
MA;0,20;0,07;0,04;960,00
MT;0,17;0,07;0,04;960,00
MS;0,17;0,07;0,04;960,00
MG;0,18;0,07;0,04;0,00
PA;0,19;0,07;0,04;960,00
PB;0,18;0,07;0,04;960,00
PR;0,19;0,12;0,04;960,00
PE;0,18;0,07;0,04;960,00
PI;0,21;0,07;0,04;960,00
RN;0,20;0,07;0,04;960,00
RS;0,17;0,12;0,04;960,00
RJ;0,20;0,12;0,04;960,00
RO;0,18;0,07;0,04;960,00
RR;0,20;0,07;0,04;960,00
SC;0,17;0,12;0,04;960,00
SP;0,18;0,12;0,04;960,00
SE;0,22;0,07;0,04;960,00
TO;0,20;0,07;0,04;960,00
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
