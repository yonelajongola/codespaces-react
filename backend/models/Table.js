const mongoose = require('mongoose');
const { Schema } = mongoose;

const TableSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available'
    },
    capacity: {
        type: Number,
        default: 4
    },
    currentOrder: {
        type: Schema.Types.ObjectId,
        ref: 'kitchenorder',
        default: null
    }
});

module.exports = mongoose.model('table', TableSchema);
