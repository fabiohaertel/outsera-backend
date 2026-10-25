# Registro de interações com IA

Agente: **Claude Code** (modelo Claude Opus 5.5), extensão do VS Code.

Contexto fornecido ao agente: `AGENTS.md`/`CLAUDE.md` (stack, comandos, estrutura) e `docs/REQUIREMENTS.md` (requisitos transcritos do PDF + premissas de negócio).

## 1. Planejamento

**Prompt:** "Faça um planejamento da implementação"

O agente (em modo de planejamento, sem editar código):

- Inspecionou `package.json`, o CSV e a versão do Node (v24).
- Calculou o resultado esperado para `data/movies.csv` com um script avulso (Joel Silver 1 ano; Matthew Vaughn 13 anos), usado depois como oráculo do teste principal.
- Propôs: `node:sqlite` nativo (sem dependência externa), schema normalizado (movies, producers, studios + tabelas de junção), cálculo em SQL com window function `LAG`, parser tolerante (BOM, CRLF, colunas por nome), 404/405/500 e testes de integração com fixtures para casos de borda.

## 2. Implementação

**Prompt:** "Pode implementar o plano"

O agente implementou o plano, rodou `npm test` (12 testes passando) e validou o servidor real com uma requisição ao endpoint.

Ajustes feitos durante a implementação:

- `node --test tests/` não aceita diretório no Windows/Node 24 → script trocado para o glob `tests/**/*.test.js`.
- Adicionado `.gitattributes` para preservar BOM/CRLF da fixture `name-formats.csv`.

## 3. Script para subir com outro CSV

**Prompt:** "Adicione uma task para subir o server com um csv diferente, CSV_PATH de exemplo. Atualize os docs com esse log da AI"

O agente:

- Criou `.env.example` com `CSV_PATH=tests/fixtures/ties.csv` e o script `npm run start:example` (`node --env-file=.env.example src/server.js`).
- Optou por `--env-file` nativo do Node em vez de `CSV_PATH=... node ...` no script, que não funciona no `cmd`/PowerShell do Windows, e em vez de adicionar a dependência `cross-env`.
- Validou subindo o servidor com o script e consultando o endpoint (empates: min 1 ano para Producer A e B; max 10 anos para Producer A e C).
- Atualizou `README.md` e `AGENTS.md` com o novo comando.
