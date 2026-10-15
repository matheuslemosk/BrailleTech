// ---------------------------------------------------------------------
// INTERFACE DO SITE
// Aqui fica tudo que mexe na tela. A tabela e a tradução ficam em
// braille.js (que é carregado antes deste arquivo).
// ---------------------------------------------------------------------

function desenharCelulas(celulas, elemento){
  elemento.innerHTML = '';
  const ordemVisual = [1,4,2,5,3,6];

  for(const c of celulas){
    if(c.origem === ' ' || c.origem === '\n') continue;

    const div = document.createElement('div');
    div.className = 'celula';

    for(const p of ordemVisual){
      const ponto = document.createElement('div');
      ponto.className = 'ponto' + (c.pontos.includes(p) ? ' ativo' : '');
      div.appendChild(ponto);
    }

    const letra = document.createElement('span');
    letra.className = 'letra';
    letra.textContent = c.origem;
    div.appendChild(letra);

    elemento.appendChild(div);
  }
}

function mostrarAviso(semCorrespondencia){
  const avisoEl = document.getElementById('aviso');
  if(semCorrespondencia.size === 0){
    avisoEl.classList.add('oculto');
    avisoEl.textContent = '';
    return;
  }
  const lista = Array.from(semCorrespondencia).join(' ');
  avisoEl.textContent = 'Atenção: estes caracteres ainda não têm tradução nesta versão simples: ' + lista;
  avisoEl.classList.remove('oculto');
}

// ---------------------------------------------------------------------
// SALVAR NO BANCO DE DADOS
// Ao clicar em "Salvar tradução", o texto é enviado para o servidor
// (rota POST /api/traducoes), que faz a tradução e guarda tudo na
// tabela "traducoes" do banco SQLite.
// ---------------------------------------------------------------------

let ultimoTextoSalvo = '';

function mostrarMensagemSalvar(mensagem, ehErro){
  const mensagemEl = document.getElementById('mensagemSalvar');
  mensagemEl.textContent = mensagem;
  mensagemEl.classList.toggle('erro', ehErro === true);
}

async function salvarTraducao(){
  const texto = document.getElementById('entrada').value;
  if(!texto.trim()) return;

  // não salva duas vezes o mesmo texto seguido
  if(texto === ultimoTextoSalvo){
    mostrarMensagemSalvar('Essa tradução já foi salva.', true);
    return;
  }

  const botao = document.getElementById('btnSalvar');
  botao.disabled = true; // evita clicar duas vezes enquanto envia

  try{
    const resposta = await fetch('/api/traducoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: texto })
    });

    if(resposta.ok){
      const traducao = await resposta.json();
      ultimoTextoSalvo = texto;
      mostrarMensagemSalvar('Tradução salva no banco de dados (nº ' + traducao.id + ').', false);
    } else {
      mostrarMensagemSalvar('Não foi possível salvar. Tente de novo.', true);
    }
  } catch(erro){
    // Se o servidor estiver desligado, o site continua traduzindo normalmente,
    // só não consegue guardar no banco.
    mostrarMensagemSalvar('Não foi possível salvar: o servidor está desligado.', true);
  }

  botao.disabled = !document.getElementById('entrada').value.trim();
}

// ---------------------------------------------------------------------
// TRADUZIR ENQUANTO DIGITA
// ---------------------------------------------------------------------

let ultimaTraducao = null;

function traduzirAoDigitar(){
  const texto = document.getElementById('entrada').value;

  document.getElementById('contador').textContent = texto.length + '/500';

  // some o aviso de "salva" quando o texto muda
  mostrarMensagemSalvar('', false);

  if(!texto.trim()){
    ultimaTraducao = null;
    document.getElementById('btnSalvar').disabled = true;
    document.getElementById('resultado').classList.add('oculto');
    document.getElementById('saidaVazia').classList.remove('oculto');
    document.getElementById('aviso').classList.add('oculto');
    return;
  }

  const { celulas, semCorrespondencia } = traduzirTexto(texto);
  ultimaTraducao = celulas;

  document.getElementById('brailleUnicode').textContent =
    celulas.map(c => pontosParaUnicode(c.pontos)).join('');
  desenharCelulas(celulas, document.getElementById('celulas'));
  mostrarAviso(semCorrespondencia);

  document.getElementById('resultado').classList.remove('oculto');
  document.getElementById('saidaVazia').classList.add('oculto');
  document.getElementById('btnSalvar').disabled = false;
}

function copiarResultado(){
  if(!ultimaTraducao) return;
  const textoBraille = ultimaTraducao.map(c => pontosParaUnicode(c.pontos)).join('');
  navigator.clipboard.writeText(textoBraille).catch(() => {
    // navegadores mais antigos podem não ter a API de clipboard;
    // nesse caso, simplesmente não faz nada.
  });
}

function limpar(){
  document.getElementById('entrada').value = '';
  traduzirAoDigitar();
}

document.getElementById('entrada').addEventListener('input', traduzirAoDigitar);
document.getElementById('btnCopiar').addEventListener('click', copiarResultado);
document.getElementById('btnLimpar').addEventListener('click', limpar);
document.getElementById('btnSalvar').addEventListener('click', salvarTraducao);

/*
  PRÓXIMO PASSO (etapa 2 da metodologia): comunicação com o Arduino.

  Quando o hardware estiver pronto, dá pra usar a Web Bluetooth API do
  navegador para conectar no Arduino e mandar o array de "pontos" de
  cada célula (o mesmo que fica guardado em "ultimaTraducao" e na coluna
  "pontos" da tabela "traducoes") para os microatuadores. Fica só o
  esqueleto aqui como referência - ainda precisa dos IDs (UUIDs) do
  serviço Bluetooth que forem definidos na programação do Arduino:

  async function conectarArduino(){
    const dispositivo = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
      // depois trocar por: filters: [{ services: ['UUID-DO-SERVICO'] }]
    });
    const servidor = await dispositivo.gatt.connect();
    // const servico = await servidor.getPrimaryService('UUID-DO-SERVICO');
    // const caracteristica = await servico.getCharacteristic('UUID-DA-CARACTERISTICA');
    // ... enviar os dados de "ultimaTraducao" para a característica
  }
*/
