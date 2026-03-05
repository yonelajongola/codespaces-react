const mongoose = require('mongoose');
const { Schema } = mongoose;

const KitchenOrderSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            notes: { type: String, default: '' }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'served'],
        default: 'pending'
    },
    workerEmail: {
        type: String
    },
    workerName: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('kitchenorder', KitchenOrderSchema);
