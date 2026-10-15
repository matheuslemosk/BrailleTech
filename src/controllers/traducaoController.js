// Controller: recebe o pedido (req), usa o model e devolve a resposta (res).

const model = require('../models/traducaoModel');

// Usa a MESMA tabela Braille do site (public/js/braille.js)
const { pontosParaUnicode, traduzirTexto } = require('../../public/js/braille.js');

// POST /api/traducoes
// Recebe { texto: "..." }, traduz e salva no banco.
function salvar(req, res){
  const texto = req.body.texto;

  if(typeof texto !== 'string' || !texto.trim()){
    return res.status(400).json({ erro: 'Envie um texto para traduzir.' });
  }
  if(texto.length > 500){
    return res.status(400).json({ erro: 'O texto pode ter no máximo 500 caracteres.' });
  }

  const { celulas } = traduzirTexto(texto);
  const braille = celulas.map(c => pontosParaUnicode(c.pontos)).join('');
  const pontos = celulas.map(c => ({ caractere: c.origem, pontos: c.pontos }));

  const traducao = model.criar(texto, braille, pontos);
  res.status(201).json(traducao);
}

// GET /api/traducoes  -> as 100 traduções mais recentes
function listar(req, res){
  res.json(model.listar());
}

// GET /api/traducoes/ultima  -> a tradução mais recente
function buscarUltima(req, res){
  const traducao = model.buscarUltima();
  if(!traducao){
    return res.status(404).json({ erro: 'Ainda não existe nenhuma tradução salva.' });
  }
  res.json(traducao);
}

// GET /api/traducoes/:id  -> uma tradução específica
function buscarUma(req, res){
  const traducao = model.buscarPorId(req.params.id);
  if(!traducao){
    return res.status(404).json({ erro: 'Tradução não encontrada.' });
  }
  res.json(traducao);
}

module.exports = { salvar, listar, buscarUltima, buscarUma };
