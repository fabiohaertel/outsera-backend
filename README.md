# Golden Raspberry Awards API

API RESTful (Richardson nível 2) que lê a lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards e informa os produtores com o menor e o maior intervalo entre dois prêmios consecutivos.

## Requisitos

- Node.js **22.13 ou superior** (usa o módulo nativo `node:sqlite`; nenhuma instalação de banco é necessária).

## Instalação

```bash
npm install
```

## Executando

```bash
npm start
```

O CSV é carregado num SQLite em memória antes de o servidor aceitar requisições. Se o arquivo não puder ser lido ou for inválido, a aplicação encerra com código 1.

| Variável   | Padrão            | Descrição                    |
|------------|-------------------|------------------------------|
| `CSV_PATH` | `data/movies.csv` | Caminho do CSV a ser carregado |
| `PORT`     | `3000`            | Porta HTTP                   |

```bash
# Linux/macOS
CSV_PATH=/caminho/outro.csv PORT=8080 npm start
# PowerShell
$env:CSV_PATH="C:\caminho\outro.csv"; npm start
```

Para subir com um CSV de exemplo diferente, sem configurar variáveis manualmente (funciona em qualquer SO):

```bash
npm run start:example
```

O script usa `node --env-file=.env.example`, que define `CSV_PATH=tests/fixtures/ties.csv` (cenário com empates). Edite `.env.example` para apontar para outro arquivo. Variáveis já definidas no ambiente têm precedência sobre as do arquivo (ex.: `PORT=8080 npm run start:example`).

### Formato do CSV

Separador `;` e cabeçalho com as colunas `year;title;studios;producers;winner` (a ordem e a caixa das colunas não importam). `winner = yes` indica vencedor. Produtores múltiplos são separados por `, ` e/ou ` and `.

## Endpoint

`GET /producers/award-intervals` → `200 OK`

```bash
curl http://localhost:3000/producers/award-intervals
```

```json
{
  "min": [{ "producer": "Joel Silver", "interval": 1, "previousWin": 1990, "followingWin": 1991 }],
  "max": [{ "producer": "Matthew Vaughn", "interval": 13, "previousWin": 2002, "followingWin": 2015 }]
}
```

Outros status: `404` para recursos inexistentes, `405` (com header `Allow`) para métodos não suportados e `500` para erros internos — todos com corpo `{ "error": "..." }`.

### Regras de cálculo

- Apenas filmes vencedores são considerados.
- Para cada produtor com 2+ vitórias, calcula-se o intervalo entre cada par de vitórias **consecutivas**.
- `min`/`max` trazem todos os intervalos iguais ao menor/maior valor (empates retornam vários itens, inclusive do mesmo produtor).
- Vitórias do mesmo produtor no mesmo ano contam uma vez.
- Sem produtores com 2+ vitórias: `{ "min": [], "max": [] }`.

## Testes

```bash
npm test
```

Somente testes de integração (`node:test` + `supertest`): sobem a aplicação completa (CSV → SQLite → Express) e validam as respostas HTTP. Cobrem o `data/movies.csv` fornecido e cenários em `tests/fixtures/` (empates, nenhum produtor repetido, vitórias no mesmo ano, formatos de nomes, BOM/CRLF, CSV inválido).

## Estrutura

```
src/
  server.js                      # entrypoint: carrega o CSV e inicia o servidor
  app.js                         # app Express, 404 e 500
  config.js                      # CSV_PATH e PORT
  database/connection.js         # SQLite em memória + schema
  csv/                           # parsing do CSV e separação de nomes
  loaders/loadMovies.js          # insere os filmes numa transação
  repositories/producerRepository.js  # consulta SQL dos intervalos
  routes/producers.js            # GET /producers/award-intervals
tests/                           # testes de integração e fixtures
docs/                            # requisitos e registro de interações com IA
```

## Uso de IA

O registro das interações com o agente está em [docs/AI_INTERACTIONS.md](docs/AI_INTERACTIONS.md).
