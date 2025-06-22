# Atividade 4 - Projeto PetLovers (PL) – Integração com API REST

Este repositório apresenta a **quarta versão** do sistema **PetLovers (PL)**, que agora está totalmente integrado a um **serviço back-end baseado em API REST**. O objetivo é construir uma interface front-end com React + TypeScript, utilizando **componentes de função com hooks**, que se comunique diretamente com o back-end (Java ou Node.js).

---

## 🎯 Objetivo

Implementar uma interface gráfica funcional, moderna e responsiva, com foco na **comunicação entre front-end e back-end** via **requisições HTTP** utilizando o padrão REST, eliminando o uso de `localStorage` para armazenamento de dados.

---

## 🧰 Tecnologias Utilizadas

- **React 18.2.0** – biblioteca para construção da interface gráfica  
- **TypeScript** – tipagem estática e estrutura robusta  
- **ShadCN + Tailwind CSS** – estilização moderna e responsiva  
- **React Hooks** – `useState`, `useEffect`, etc.  
- **Axios** – biblioteca para requisições HTTP  
- **Java 17+ ou Node.js** – servidor back-end

---

## 🎥 Demonstração em Vídeo





https://github.com/user-attachments/assets/1324ffb8-95fd-4865-83ee-07b0640430cc




---

## 🌐 Comunicação com o Back-end

A aplicação é compatível com **dois tipos de servidores** RESTful:

### ✅ Opção 1: Back-end Java fornecido

Requer execução do `pl.jar` e se comunica nos seguintes endpoints:

- `GET    http://localhost:32831/cliente/clientes` – Listar todos os clientes  
- `GET    http://localhost:32831/cliente/{id}` – Obter um cliente por ID  
- `POST   http://localhost:32831/cliente/cadastrar` – Cadastrar novo cliente  
- `DELETE http://localhost:32831/cliente/excluir` – Excluir cliente  
- `PUT    http://localhost:32831/cliente/atualizar` – Atualizar cliente  

> Requer Java 17+ instalado.

### ✅ Opção 2: Back-end Node.js (Express)

Você pode também utilizar um back-end desenvolvido em Node.js com Express, rodando na porta `3000`, com endpoints equivalentes:

- `GET    http://localhost:3000/clientes`  
- `GET    http://localhost:3000/clientes/:id`  
- `POST   http://localhost:3000/clientes`  
- `DELETE http://localhost:3000/clientes/:id`  
- `PUT    http://localhost:3000/clientes/:id`  

> Requer Node.js instalado e servidor Express configurado.

---

## 🚀 Como Executar o Projeto

> Pré-requisitos:
> - Node.js + npm (para o front-end ou o back-end alternativo)
> - Java 17+ (para o back-end original em Java)

### 🔹 Opção 1 – Executar Back-end em Java

```bash
# Acesse a pasta onde está o pl.jar
cd backend-executavel

# Inicie o micro-serviço
java -jar pl.jar
```

### 🔹 Opção 2 – Executar Back-end Express (Node.js)

```bash
# Acesse a pasta do seu servidor Express
cd backend-express

# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

### 🔹 Executar o Front-end

```bash
# Clone o repositório
git clone https://github.com/gerson-pn/atviv-pl

# Acesse o diretório
cd atviv-pl

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

> ⚙️ Certifique-se de que a URL base usada pelo Axios no front-end aponte corretamente para `http://localhost:32831` ou `http://localhost:3000`, dependendo do back-end usado.

---

## 🖥️ Funcionalidades

A interface permite que o usuário realize:

- ✅ Listagem de clientes diretamente da API  
- ➕ Cadastro de novos clientes  
- ✏️ Edição de dados dos clientes  
- ❌ Remoção de clientes da base  
- 🔄 Atualizações em tempo real com persistência na API

---

## 👨‍💻 Desenvolvedor

Sistema desenvolvido como parte da disciplina de Programação Orientada a Objetos, com foco em integração entre front-end e back-end RESTful, utilizando componentes modernos do React.

---

