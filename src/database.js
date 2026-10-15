// Conexão com o banco de dados SQLite.
// O arquivo do banco é criado sozinho em banco/traducoes.db
// na primeira vez que o servidor liga.

const Database = require('better-sqlite3');
const path = require('path');

const caminhoDoBanco = path.join(__dirname, '..', 'banco', 'traducoes.db');
const db = new Database(caminhoDoBanco);

// Cria a tabela se ela ainda não existir.
//   id        -> número da tradução (automático)
//   texto     -> o que a pessoa digitou
//   braille   -> o resultado em caracteres Braille (ex.: ⠃⠗⠁⠊⠇⠇⠑)
//   pontos    -> os pontos de cada célula, em formato JSON (é isso que o Arduino vai usar)
//   criado_em -> data e hora em que foi salva
db.exec(`
  CREATE TABLE IF NOT EXISTS traducoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    braille TEXT NOT NULL,
    pontos TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);

module.exports = db;
