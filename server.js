// server.js
require('dotenv').config(); // Carrega as variáveis do .env

const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/Order'); // Importa o modelo Order

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar requisições JSON
app.use(express.json());

// ------------------------------------
// Conexão com o Banco de Dados
// ------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conexão com MongoDB estabelecida com sucesso!'))
    .catch(err => console.error('❌ Erro de conexão com MongoDB:', err));

// ------------------------------------
// Função de Mapeamento (Data Transformation)
// ------------------------------------
// Transforma os dados de entrada (numeroPedido, valorTotal, idItem) para o formato de saída (orderId, value, productId)
function mapOrderData(input) {
    return {
        // Mapeamento de campo: numeroPedido -> orderId
        orderId: input.numeroPedido,
        // Mapeamento de campo: valorTotal -> value
        value: input.valorTotal,
        // Mapeamento de campo: dataCriacao -> creationDate e conversão para objeto Date
        creationDate: new Date(input.dataCriacao), 
        
        // Mapeamento e iteração sobre o array de Itens (Array.map())
        items: input.items.map(item => ({
            productId: parseInt(item.idItem), // Mapeamento: idItem -> productId
            quantity: item.quantidadeItem,    // Mapeamento: quantidadeItem -> quantity
            price: item.valorItem             // Mapeamento: valorItem -> price
        }))
    };
}

// ------------------------------------
// 1. Rota POST /order (Criar Pedido) - Obrigatório
// ------------------------------------
app.post('/order', async (req, res) => {
    try {
        const orderInput = req.body;
        
        // 1. Mapeamento de Dados
        const newOrderData = mapOrderData(orderInput);

        // 2. Cria e Salva no Banco de Dados
        const newOrder = new Order(newOrderData);
        await newOrder.save();

        // 3. Resposta de Sucesso: 201 Created é a resposta correta para criação [cite: 250]
        res.status(201).json({ message: "Pedido criado com sucesso!", data: newOrder });

    } catch (error) {
        // Tratamento de Erro Robusto[cite: 249]: Trata chaves duplicadas (orderId)
        if (error.code === 11000) { 
            return res.status(409).json({ error: "Pedido com este orderId já existe." });
        }
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor ao criar pedido.", details: error.message });
    }
});

// ROTA 2: Listar todos os pedidos (Opcional)
app.get('/order/list', async (req, res) => {
    try {
        // Encontra TODOS os documentos na collection 'Order'
        const orders = await Order.find();

        // Responde com status 200 OK e a lista de pedidos
        res.status(200).json(orders);
    } catch (error) {
        // Responde com erro 500 caso haja falha no servidor ou no banco de dados
        console.error("Erro ao listar pedidos:", error.message);
        res.status(500).json({ 
            message: 'Erro interno do servidor ao listar pedidos', 
            error: error.message 
        });
    }
});

// ------------------------------------
// 3. Rota GET /order/{orderId} (Buscar Pedido) - Obrigatório
// ------------------------------------
app.get('/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        // Busca o pedido no BD usando o orderId fornecido na URL
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            // 404 Not Found se o recurso não existe [cite: 250]
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        // 200 OK e retorna o objeto encontrado [cite: 250]
        res.status(200).json({ data: order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor ao buscar pedido." });
    }
});

// ROTA 4: Atualizar um pedido (Opcional)
app.put('/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const updatedData = req.body; // Dados para atualizar (ex: mudar o valor)

        // Encontra o pedido pelo orderId e atualiza
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId }, // Filtro: Encontra pelo campo 'orderId'
            updatedData,          // Dados a serem atualizados
            { new: true }         // Retorna o documento atualizado
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Pedido não encontrado para atualização.' });
        }

        // Responde com o status 200 OK e o pedido atualizado
        res.status(200).json({ 
            message: 'Pedido atualizado com sucesso!', 
            order: updatedOrder 
        });
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error.message);
        res.status(500).json({ 
            message: 'Erro interno do servidor ao atualizar pedido', 
            error: error.message 
        });
    }
});

// ROTA 5: Deletar um pedido (Opcional)
app.delete('/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Encontra o pedido pelo orderId e o remove
        const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });

        if (!deletedOrder) {
            // Se o Mongoose retornar null, o pedido não existe
            return res.status(404).json({ message: 'Pedido não encontrado para exclusão.' });
        }

        // Responde com status 204 No Content (padrão para sucesso de DELETE)
        res.status(204).send(); 
    } catch (error) {
        console.error("Erro ao deletar pedido:", error.message);
        res.status(500).json({ 
            message: 'Erro interno do servidor ao deletar pedido', 
            error: error.message 
        });
    }
});

// Inicia o servidor Node.js na porta configurada
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

