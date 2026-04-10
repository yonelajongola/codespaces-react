const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['ingredient', 'beverage', 'supply']
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    minStock: {
        type: Number,
        default: 10
    },
    cost: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('inventory', InventorySchema);
