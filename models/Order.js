// models/Order.js
const mongoose = require('mongoose');

// 1. Define o Schema para os Itens (items) - baseia-se na estrutura do JSON de saída
const ItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
}, { _id: false }); 

// 2. Define o Schema principal para o Pedido (Order)
const OrderSchema = new mongoose.Schema({
    // orderId é a chave principal e deve ser única (mapeada de numeroPedido)
    orderId: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    value: { 
        type: Number, 
        required: true 
    },
    creationDate: { 
        type: Date, // Date é o tipo de dado correto para data/hora
        required: true 
    },
    items: [ItemSchema] // Lista de Itens
}, { timestamps: true });

// 3. Exporta o Modelo que a API usará para salvar/buscar no MongoDB
module.exports = mongoose.model('Order', OrderSchema);
