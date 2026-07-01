# Perdidos & Achados — Web App

Sistema web para divulgação de objetos perdidos e achados, desenvolvido como projeto de extensão da graduação em **Análise e Desenvolvimento de Sistemas (ADS)**.

## Links

| Recurso | URL |
|---------|-----|
| **Aplicação online** | [achados-e-perdidos-web.vercel.app](https://achados-e-perdidos-web.vercel.app) |
| **Página do projeto (GitHub Pages)** | [wesleywerikis.github.io/achados-e-perdidos-web](https://wesleywerikis.github.io/achados-e-perdidos-web/) |
| **Repositório** | [github.com/wesleywerikis/achados-e-perdidos-web](https://github.com/wesleywerikis/achados-e-perdidos-web) |

## Sobre o projeto

A plataforma permite que usuários cadastrem-se, publiquem anúncios de itens perdidos ou encontrados e consultem os anúncios mais recentes. Apenas o dono de um anúncio pode editá-lo ou excluí-lo.

### Funcionalidades

- Cadastro e login de usuários
- Listagem pública dos últimos anúncios
- Criação de anúncios (requer login)
- Edição e exclusão de anúncios próprios
- Categorias: Documento, Eletrônico, Animal, Outro

## Diferenciais técnicos

- **Arquitetura serverless**: API REST em funções Node.js na Vercel, sem servidor dedicado
- **Banco relacional na nuvem**: PostgreSQL com conexão via variáveis de ambiente
- **Frontend leve**: HTML, CSS e JavaScript vanilla, sem frameworks pesados
- **Separação clara**: frontend estático + backend em `/api`
- **Controle de propriedade**: validação de dono do anúncio no frontend e no backend
- **Deploy contínuo**: integração GitHub → Vercel para publicação automática

## Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | Node.js (Vercel Serverless Functions) |
| Banco de dados | PostgreSQL |
| Hospedagem da app | [Vercel](https://vercel.com) |
| Documentação / landing | [GitHub Pages](https://pages.github.com) |

## Estrutura do projeto

```
achados-e-perdidos-web/
├── api/                  # Endpoints serverless (Vercel)
│   ├── anuncios.js       # GET (listar) e POST (criar)
│   ├── anuncio.js        # GET, PUT e DELETE por ID
│   ├── login.js          # Autenticação
│   └── usuarios.js       # Cadastro de usuários
├── css/                  # Estilos globais e de anúncios
├── js/                   # Lógica do frontend
├── pages/                # Páginas HTML (login, cadastro, CRUD)
├── docs/                 # Página de informações (GitHub Pages)
├── index.html            # Página inicial (listagem)
├── vercel.json           # Configuração de deploy
└── package.json
```

## API REST

Base URL em produção: `https://achados-e-perdidos-web.vercel.app/api`

### `POST /api/usuarios`

Cadastra um novo usuário.

```json
{ "nome": "João", "email": "joao@email.com", "senha": "123456" }
```

### `POST /api/login`

Autentica e retorna dados do usuário.

```json
{ "email": "joao@email.com", "senha": "123456" }
```

### `GET /api/anuncios`

Lista todos os anúncios (ordenados por data de criação).

### `POST /api/anuncios`

Cria um anúncio. Requer `donoEmail` de usuário cadastrado.

```json
{
  "titulo": "Carteira perdida",
  "descricao": "Carteira marrom com documentos",
  "categoria": "Documento",
  "local": "Campus central",
  "donoEmail": "joao@email.com"
}
```

### `GET /api/anuncio?id={id}`

Retorna um anúncio específico.

### `PUT /api/anuncio?id={id}`

Atualiza título, descrição, categoria e local.

### `DELETE /api/anuncio?id={id}`

Remove um anúncio.

## Banco de dados

### Tabela `usuarios`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial | PK |
| nome | varchar | Nome do usuário |
| email | varchar | E-mail (único) |
| senha | varchar | Senha |

### Tabela `anuncios`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | serial | PK |
| titulo | varchar | Título do anúncio |
| descricao | text | Descrição detalhada |
| categoria | varchar | Categoria do item |
| local | varchar | Local onde foi perdido/achado |
| dono_email | varchar | FK lógica para `usuarios.email` |
| criado_em | timestamp | Data de criação |

## Executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- Banco PostgreSQL (ex.: [Neon](https://neon.tech) ou Vercel Postgres)

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/wesleywerikis/achados-e-perdidos-web.git
   cd achados-e-perdidos-web
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure a variável de ambiente `POSTGRES_URL` com a connection string do banco.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`.

## Deploy

### Aplicação (Vercel)

1. Conecte o repositório GitHub à Vercel.
2. Configure `POSTGRES_URL` (ou equivalente) nas variáveis de ambiente do projeto.
3. O deploy ocorre automaticamente a cada push na branch principal.

### Página de informações (GitHub Pages)

1. No GitHub: **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / pasta **`/docs`**
4. Salve. A página ficará em `https://wesleywerikis.github.io/achados-e-perdidos-web/`

> A aplicação completa (com API e banco) roda na Vercel. O GitHub Pages hospeda apenas a página de documentação/informações do projeto.

## Equipe

Projeto de extensão — Análise e Desenvolvimento de Sistemas.

## Licença

Projeto acadêmico. Código-fonte disponível publicamente neste repositório.
