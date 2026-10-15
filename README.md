# BrailleTech

Tradutor de texto para Braille — Projeto Integrador I (IFSP Campus Campinas). TESTE TESTE TESTE

O site traduz o texto digitado para Braille (Grafia Braille para a Língua Portuguesa, grau 1)
e guarda cada tradução em um banco de dados SQLite. Essas traduções guardadas serão usadas
depois na conexão com o Arduino da caneta.

## Como rodar

Precisa ter o [Node.js](https://nodejs.org) instalado.

```
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.
(O `npm install` só precisa ser feito na primeira vez.)

> O site precisa ser aberto por esse endereço. Se abrir o arquivo `index.html` direto
> com dois cliques, o visual e a tradução não carregam.

## Estrutura das pastas

```
Site_Braille_Tech/
├── server.js                  -> liga o servidor
├── package.json               -> lista de dependências (Express e better-sqlite3)
├── banco/
│   └── traducoes.db           -> banco de dados (criado sozinho ao ligar o servidor)
├── public/                    -> tudo que o navegador usa
│   ├── html/index.html        -> página do site
│   ├── css/style.css          -> visual
│   └── js/
│       ├── braille.js         -> tabela Braille e função que traduz
│       └── app.js             -> tela: digitar, mostrar resultado, salvar
└── src/                       -> parte do servidor (MVC)
    ├── database.js            -> conexão com o banco e criação da tabela
    ├── models/traducaoModel.js
    ├── controllers/traducaoController.js
    └── routes/traducaoRoutes.js
```

## Banco de dados

Tabela `traducoes`:

| Coluna      | O que guarda                                                          |
|-------------|-----------------------------------------------------------------------|
| `id`        | número da tradução (automático)                                       |
| `texto`     | o texto que a pessoa digitou                                          |
| `braille`   | o resultado em caracteres Braille (ex.: ⠃⠗⠁⠊⠇⠇⠑)                      |
| `pontos`    | os pontos de cada célula, em JSON (é isso que o Arduino vai receber)  |
| `criado_em` | data e hora em que foi salva                                          |

A tradução só vai para o banco quando a pessoa clica em **Salvar tradução** (o botão fica
desativado enquanto não houver texto). O site mostra um aviso com o número da tradução salva,
e o mesmo texto não é salvo duas vezes seguidas.

O arquivo `banco/traducoes.db` não vai para o GitHub (está no `.gitignore`): cada pessoa
tem o seu, criado automaticamente. Para ver o conteúdo, dá para abrir o arquivo no
[DB Browser for SQLite](https://sqlitebrowser.org) ou acessar a API abaixo no navegador.

## API (para usar depois com o Arduino)

| Método | Endereço                 | O que faz                                      |
|--------|--------------------------|------------------------------------------------|
| POST   | `/api/traducoes`         | recebe `{ "texto": "..." }`, traduz e salva    |
| GET    | `/api/traducoes`         | lista as 100 traduções mais recentes           |
| GET    | `/api/traducoes/ultima`  | devolve a tradução mais recente                |
| GET    | `/api/traducoes/:id`     | devolve uma tradução específica                |

Exemplo: abra http://localhost:3000/api/traducoes/ultima no navegador.

