// ---------------------------------------------------------------------
// TABELA BRAILLE (Grafia Braille para a Língua Portuguesa - grau 1)
// Cada letra/símbolo aponta para a lista de pontos "acesos" da célula.
// Pontos são numerados de 1 a 6, na ordem:
//   1 4
//   2 5
//   3 6
// ---------------------------------------------------------------------
const tabelaBraille = {
  'a': [1],         'b': [1,2],       'c': [1,4],
  'd': [1,4,5],     'e': [1,5],       'f': [1,2,4],
  'g': [1,2,4,5],   'h': [1,2,5],     'i': [2,4],
  'j': [2,4,5],     'k': [1,3],       'l': [1,2,3],
  'm': [1,3,4],     'n': [1,3,4,5],   'o': [1,3,5],
  'p': [1,2,3,4],   'q': [1,2,3,4,5], 'r': [1,2,3,5],
  's': [2,3,4],     't': [2,3,4,5],   'u': [1,3,6],
  'v': [1,2,3,6],   'x': [1,3,4,6],   'z': [1,3,5,6],
  'w': [2,4,5,6],   'y': [1,3,4,5,6],

  // vogais acentuadas e letras especiais do português
  'á': [1,2,3,5,6], 'à': [1,2,4,6],   'â': [1,6],     'ã': [3,4,5],
  'é': [1,2,3,4,5,6], 'ê': [1,2,6],
  'í': [3,4],
  'ó': [3,4,6],     'ô': [1,4,5,6],   'õ': [2,4,6],
  'ú': [2,3,4,5,6], 'ü': [1,2,5,6],
  'ç': [1,2,3,4,6],

  // espaço e pontuação básica
  ' ': [],
  ',': [2],
  ';': [2,3],
  ':': [2,5],
  '.': [3],
  '!': [2,3,5],
  '?': [2,6],
  '-': [3,6]
};

// Dígitos 0-9 usam o mesmo desenho das letras a-j, precedidos do
// "sinal de número" (pontos 3,4,5,6).
const letraDoDigito = ['j','a','b','c','d','e','f','g','h','i']; // 0..9
const sinalDeNumero = [3,4,5,6];

// Converte uma lista de pontos (ex.: [1,4,5]) para o caractere Unicode
// de Braille correspondente (bloco U+2800).
function pontosParaUnicode(pontos){
  let valor = 0;
  for(const p of pontos){
    valor += Math.pow(2, p - 1);
  }
  return String.fromCodePoint(0x2800 + valor);
}

// Traduz o texto inteiro em uma lista de células Braille.
// Cada célula é um objeto: { origem: 'a', pontos: [1] }
function traduzirTexto(texto){
  const celulas = [];
  const semCorrespondencia = new Set();
  let dentroDeNumero = false;

  const texto2 = texto.toLowerCase();

  for(const ch of texto2){
    const ehDigito = ch >= '0' && ch <= '9';

    if(ehDigito){
      if(!dentroDeNumero){
        celulas.push({ origem: '#', pontos: sinalDeNumero });
        dentroDeNumero = true;
      }
      const letra = letraDoDigito[Number(ch)];
      celulas.push({ origem: ch, pontos: tabelaBraille[letra] });
      continue;
    }

    dentroDeNumero = false;

    if(ch in tabelaBraille){
      celulas.push({ origem: ch, pontos: tabelaBraille[ch] });
    } else if(ch === '\n'){
      celulas.push({ origem: '\n', pontos: [] });
    } else {
      // caractere não reconhecido nesta versão simplificada
      semCorrespondencia.add(ch);
      celulas.push({ origem: ch, pontos: [] });
    }
  }

  return { celulas, semCorrespondencia };
}

// Esta linha deixa o servidor (Node) usar a mesma tabela do navegador,
// assim a tradução guardada no banco é sempre igual à que aparece no site.
// No navegador "module" não existe, então a linha é ignorada.
if (typeof module !== 'undefined') {
  module.exports = { tabelaBraille, pontosParaUnicode, traduzirTexto };
}
