// Servidor do BrailleTech.
// Para ligar: npm install (só na primeira vez) e depois npm start

const express = require('express');
const path = require('path');
const traducaoRoutes = require('./src/routes/traducaoRoutes');

const app = express();
const PORTA = process.env.PORT || 3000;

// Permite receber JSON nas requisições
app.use(express.json());

// Arquivos do site: /css/..., /js/...
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// API das traduções (banco de dados)
app.use('/api/traducoes', traducaoRoutes);

app.listen(PORTA, () => {
  console.log('BrailleTech rodando em http://localhost:' + PORTA);
});
