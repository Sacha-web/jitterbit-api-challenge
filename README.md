# 💻 Desafio API de Pedidos Jitterbit

## Descrição do Projeto

Este projeto consiste em uma API RESTful desenvolvida em **Node.js** e **Express**, utilizando **MongoDB** como banco de dados (via Mongoose). A API foi criada para atender aos requisitos do Desafio Jitterbit, focando no gerenciamento de pedidos (operações CRUD).

**Funcionalidade Principal:**
A API implementa a **transformação de dados (mapping)** obrigatória, convertendo o JSON de entrada do cliente para o modelo de dados exigido para persistência no MongoDB.

---

## 🚀 Tecnologias Utilizadas

* **Linguagem:** JavaScript (Node.js)
* **Framework:** Express
* **Banco de Dados:** MongoDB (com Mongoose)
* **Ferramentas:** Nodemon (para desenvolvimento) e Dotenv (para variáveis de ambiente).

---

## 🛠️ Como Executar a Aplicação Localmente

Para rodar este projeto em sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** e o **npm** instalados.

### 2. Instalação das Dependências
Abra o terminal na pasta raiz do projeto e execute:
```bash
npm install

3. Configuração do Banco de Dados

Crie um arquivo na raiz do projeto chamado .env e configure as variáveis de ambiente com suas credenciais do MongoDB Atlas:
Snippet de código

MONGO_URI=mongodb+srv://<db_user>:<db_password>@<cluster_url>
PORT=3000

(Nota: Este arquivo .env foi ignorado pelo .gitignore, mantendo minhas credenciais seguras.)

4. Inicializar o Servidor

Execute o servidor em modo de desenvolvimento (com Nodemon) usando o script definido no package.json:
Bash

npm run dev

O servidor estará rodando em http://localhost:3000.

## 🗺️ Endpoints da API

Todas as operações foram implementadas e testadas com as respostas HTTP adequadas (201 Created, 200 OK, 204 No Content, 404 Not Found).

| Método | Endpoint | Descrição | Status de Sucesso |
| :--- | :--- | :--- | :--- |
| **POST** | `/order` | **(OBRIGATÓRIO)** Cria um novo pedido, aplicando a transformação (mapping) de dados do JSON de entrada. | 201 Created |
| **GET** | `/order/:orderId` | **(OBRIGATÓRIO)** Busca um pedido específico pelo seu ID. | 200 OK |
| **GET** | `/order/list` | **(OPCIONAL)** Lista todos os pedidos salvos no banco de dados. | 200 OK |
| **PUT** | `/order/:orderId` | **(OPCIONAL)** Atualiza os dados de um pedido existente (ex: valor) pelo ID. | 200 OK |
| **DELETE** | `/order/:orderId` | **(OPCIONAL)** Remove um pedido do banco de dados. | 204 No Content |

Autor: Sacha Gonzaga e Silva
LinkedIn: https://www.linkedin.com/in/sachasilva/

 
