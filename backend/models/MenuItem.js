const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('menuitem', MenuItemSchema);
