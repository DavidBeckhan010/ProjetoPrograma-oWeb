# Backend — criação do banco de dados, seed, `.env` e execução

Este guia mostra como configurar o backend, criar o banco SQLite, inserir dados iniciais com seed e rodar a API.

---

## 1. Entrar na pasta do backend

No terminal, acesse a pasta do backend:

```bash
cd backend
```

## 2. Instalar as dependências

Execute:

```bash
npm install
```

## 3. Criar o arquivo .env

Dentro da pasta `backend`, crie um arquivo chamado `.env` com o conteúdo abaixo:

```env
PORT=3333
DATABASE_URL=./database.sqlite
JWT_SECRET=conectserv_secret_dev_123
JWT_EXPIRES_IN=1d
```

## 4. Gerar as migrations do banco

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 5. Rodando backend

```bash
npm run dev
```