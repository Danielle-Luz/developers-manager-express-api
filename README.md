<h1 align="center">Developers Manager</h1>

<p align="center">
    <img alt="Badge indicando que o projeto foi criado em fevereiro de 2023" src="https://img.shields.io/badge/Data%20de%20cria%C3%A7%C3%A3o-Fevereiro%2F2023-blue">
    <img alt="Badge indicando que o status do projeto é 'concluído'" src="https://img.shields.io/badge/Status-Concluído-yellow">
</p>

## Índice

• <a href="#descricao">Descrição</a>
<br>
• <a href="#tecnologias">Tecnologias</a>
<br>
• <a href="#endpoints">Endpoints do serviço</a>
<br>
• <a href="#bd">Especificações das tabelas no banco de dados</a>
<br>
• <a href="#Desenvolvedora">Desenvolvedora</a>
<br>
<p align="center">
</p>


<h2 id="descricao">Descrição</h2>
API REST feita com express e typescript desenvolvida durante o curso Kenzie Academy Brasil, é responsável pelo gerenciamento de projetos de desenvolvedores.

<h2 id="tecnologias">Tecnologias</h2>

- Typescript
- Express
- NodeJS
- PostgreSQL

<h2 id="endpoints">Endpoints do serviço</h2>

### Developers

| Verbo  | Rota                  | Responsabilidades                               |
| ------ | --------------------- | ----------------------------------------------- |
| POST   | /developers           | Cadastrar um novo desenvolvedor.                |
| GET    | /developers/:id       | Listar um desenvolvedor.                        |
| GET    | /developers/:id/projects | Listar todos os projetos de um desenvolvedor. |
| GET    | /developers           | Listar todos os desenvolvedores.                |
| PATCH  | /developers/:id       | Atualizar um desenvolvedor.                     |
| DELETE | /developers/:id       | Remover um desenvolvedor.                       |
| POST   | /developers/:id/infos | Cadastrar as infos a mais de desenvolvedor.      |
| PATCH  | /developers/:id/infos | Atualizar as infos do desenvolvedor.             |

### Projects

| Verbo  | Rota                           | Responsabilidades                                                                                         |
| ------ | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| POST   | /projects                      | Cadastrar um novo projeto                                                                                 |
| GET    | /projects/:id                  | Listar um projeto pelo id                                                                                 |
| GET    | /projects                      | Listar todos os projetos                                                                                   |
| PATCH  | /projects/:id                  | Atualizar um projeto                                                                                       |
| DELETE | /projects/:id                  | Excluir um projeto                                                                                         |
| POST   | /projects/:id/technologies     | Cadastrar uma tecnologia para um projeto, o nome da tecnologia deve ser enviada no body seguindo os nomes cadastrados previamente no banco |
| DELETE | /projects/:id/technologies/:name | Deletar uma tecnologia de um projeto                                                                       |


<h2 id="bd">Especificações das tabelas no banco de dados</h2>

### Tabela developers

- **Colunas**:
    - **id**: número, incrementação automática e chave primária.
    - **name**: string, tamanho 50 e obrigatório.
    - **email**: string, tamanho 50, obrigatório e único.
    - **developerInfoId**: inteiro, único e chave estrangeira.

### Tabela projects
- **Colunas**:
    - **id**: número, incrementação automática e chave primária.
    - **name**: string, tamanho 50 e obrigatório.
    - **description**: texto, obrigatório.
    - **estimatedTime**: string, tamanho 20 e obrigatório.
    - **repository**: string, tamanho 120 e obrigatório.
    - **startDate**: data e obrigatório.
    - **endDate**: data.
    - **developerId**: inteiro, obrigatório e chave estrangeira.

### Tabela technologies

- **Colunas**:
    - **id**: número, incrementação automática e chave primária.
    - **name**: string, tamanho 30 e obrigatório.
- **Lista de tecnologias cadastradas**:
    - JavaScript
    - Python
    - React
    - Express.js
    - HTML
    - CSS
    - Django
    - PostgreSQL
    - MongoDB

### Tabela projects_technologies

- **Colunas**:
    - **id**: número, incrementação automática e chave primária.
    - **addedIn**: data e obrigatório.
    - **projectId**: inteiro, obrigatório e chave estrangeira.
    - **technologyId**: inteiro, obrigatório e chave estrangeira.

<h2 id="Desenvolvedora">Desenvolvedora</h2>

<p align="center">
  <a href="https://github.com/Danielle-Luz">
    <img width="120px" src="https://avatars.githubusercontent.com/u/99164019?v=4" alt="foto de uma mulher parda com o cabelo castanho, sorrindo levemente na frente de um fundo verde com bits">
  </a>
</p>

<p align="center">
Danielle da Luz Nascimento
</p>

<p align="center">
<a href="https://www.linkedin.com/in/danielle-da-luz-nascimento/">@Linkedin</a>
</p>
