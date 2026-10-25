# Requisitos – Avaliação Back-End (Outsera)

> Fonte da verdade: [requirements.pdf](requirements.pdf).

## 1. Especificação do Teste

Desenvolva uma API RESTful para possibilitar a leitura da lista de indicados e vencedores da categoria **Pior Filme** do Golden Raspberry Awards.

## 2. Requisitos funcionais

1. Ler o arquivo CSV dos filmes e inserir os dados em uma base de dados em memória ao iniciar a aplicação.

## 3. Requisitos da API

1. Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido, seguindo a especificação de formato definida na seção 6.

## 4. Requisitos não funcionais do sistema

1. O web service RESTful deve ser implementado com base no nível 2 de maturidade de Richardson;
2. Devem ser implementados somente testes de integração. Eles devem garantir que os dados obtidos estão de acordo com os dados fornecidos na proposta;
3. O banco de dados deve estar em memória utilizando um SGBD embarcado (por exemplo: H2, SQLite). Nenhuma instalação externa deve ser necessária;
4. A aplicação deve conter um readme com instruções para rodar o projeto e os testes de integração;
5. O código-fonte deve ser disponibilizado em um repositório git (Github, Gitlab, Bitbucket, etc).

## 5. LLMs, agentes e skills (inteligência artificial)

1. Para esta vaga, o uso de ferramentas de "inteligência artificial" é obrigatório e será avaliado;
2. O projeto deve conter no repositório um registro de interações com o agente. Isto pode ser disponibilizado no formato de logs, lista de prompts/skills utilizadas, ou histórico de interações.
3. A qualidade e desempenho do código serão avaliados nos mesmos critérios de uma revisão de código tradicional.

> **Atenção:** Na avaliação serão utilizados outros conjuntos de dados com cenários diferentes, portanto é importante garantir a precisão dos resultados independente dos dados de entrada.

## 6. Formato de retorno da API

**Intervalo de prêmios**

```json
{
  "min": [
    { "producer": "Producer 1", "interval": 1, "previousWin": 2008, "followingWin": 2009 },
    { "producer": "Producer 2", "interval": 1, "previousWin": 2018, "followingWin": 2019 }
  ],
  "max": [
    { "producer": "Producer 1", "interval": 99, "previousWin": 1900, "followingWin": 1999 },
    { "producer": "Producer 2", "interval": 99, "previousWin": 2000, "followingWin": 2099 }
  ]
}
```

---

## 7. Premissas e decisões (não fazem parte do enunciado)

### 7.1 Arquivo CSV (`data/movies.csv`)

- O CSV usará o separador `;`, com cabeçalho: `year;title;studios;producers;winner`.
- `winner` vale `yes` para vencedores e fica vazio para indicados.
- `producers` pode conter vários nomes separados por `, ` e/ou ` and ` (ex.: `Bob Cavallo, Joe Ruffalo and Steve Fargnoli`). Cada produtor deve ser considerado individualmente.
- `studios` também pode conter vários valores separados por `, `.
- Nomes devem ter espaços nas pontas removidos.
- O caminho do CSV deve ser configurável, já que a avaliação usará outros arquivos.

### 7.2 Banco de dados

- SQLite em memória (`:memory:`), populado na inicialização, antes de o servidor aceitar requisições.

### 7.3 Regra do intervalo de prêmios

- Considerar apenas filmes vencedores (`winner = yes`).
- Para cada produtor com 2 ou mais vitórias, ordenar os anos e calcular o intervalo entre cada par de vitórias **consecutivas**.
- `min`: todos os intervalos iguais ao menor intervalo encontrado.
- `max`: todos os intervalos iguais ao maior.
- Empates retornam múltiplos itens, inclusive do mesmo produtor (por isso o formato usa arrays).
- Sem produtores com 2+ vitórias: retornar `{ "min": [], "max": [] }`.
- Duas vitórias do mesmo produtor no mesmo ano contam uma única vez (o ano é deduplicado; não há intervalo 0).

### 7.4 API (Richardson nível 2)

- Endpoint proposto: `GET /producers/award-intervals` → `200 OK` com o JSON da seção 6.
- Uso correto de verbos HTTP e status codes (ex.: `404` para rota inexistente, `500` para erro interno).

### 7.5 Testes

- Apenas testes de integração: sobem a aplicação com o CSV fornecido e validam a resposta do endpoint contra os valores esperados para esse arquivo.
