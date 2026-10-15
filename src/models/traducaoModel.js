// Model: só conversa com o banco de dados (nada de req/res aqui).

const db = require('../database');

// O campo "pontos" é guardado como texto JSON no banco,
// então precisamos converter de volta para lista quando lemos.
function converterLinha(linha){
  if(!linha) return null;
  return {
    id: linha.id,
    texto: linha.texto,
    braille: linha.braille,
    pontos: JSON.parse(linha.pontos),
    criado_em: linha.criado_em
  };
}

function criar(texto, braille, pontos){
  const resultado = db
    .prepare('INSERT INTO traducoes (texto, braille, pontos) VALUES (?, ?, ?)')
    .run(texto, braille, JSON.stringify(pontos));

  return buscarPorId(resultado.lastInsertRowid);
}

function listar(){
  const linhas = db
    .prepare('SELECT * FROM traducoes ORDER BY id DESC LIMIT 100')
    .all();
  return linhas.map(converterLinha);
}

function buscarPorId(id){
  const linha = db.prepare('SELECT * FROM traducoes WHERE id = ?').get(id);
  return converterLinha(linha);
}

function buscarUltima(){
  const linha = db.prepare('SELECT * FROM traducoes ORDER BY id DESC LIMIT 1').get();
  return converterLinha(linha);
}

module.exports = { criar, listar, buscarPorId, buscarUltima };
