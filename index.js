const { readFileSync } = require('fs');


// Função do switch extraída
function calcularTotalApresentacao(apre){
  let total = 0;
  switch (getPeca(apre).tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
         total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
        throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
    }
  return total;
}

// Função query
function getPeca(apresentacao) {
  return pecas[apresentacao.id];
}

function calcularTotalFatura(fatura) {
  let totalFatura = 0;
  for (let apre of fatura.apresentacoes) {
    let total = calcularTotalApresentacao(apre);
  
    // mais uma linha da fatura
    totalFatura += total;
  }
  return totalFatura;
}

function calcularTotalCreditos(fatura,pecas) {
  return fatura.apresentacoes.reduce((total, apre) => total + calcularCredito(apre,pecas), 0);
}

function calcularCredito(apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(apre).tipo === "comedia") 
     creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;

    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }

    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} \n`;

    return faturaStr;
  }

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = '<html>\n';
  faturaHTML += `<p> Fatura ${fatura.cliente} </p>\n`;
  faturaHTML += '<ul>\n';

  for (let apre of fatura.apresentacoes) {
    faturaHTML += `<li>  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos) </li>\n`;
  }

  faturaHTML += '</ul>\n';

  faturaHTML += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))} </p>\n`;
  faturaHTML += `<p> Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} </p>\n`;

  faturaHTML += '</html>'

  return faturaHTML;
}








const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturasHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
console.log(faturasHTML);
