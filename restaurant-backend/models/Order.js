const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  specialInstructions: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served'],
    default: 'pending'
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table'
  },
  tableNumber: Number,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  waiterUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  waiterName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  tip: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', null],
    default: null
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeout', 'delivery'],
    default: 'dine-in'
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  },
  estimatedTime: {
    type: Number, // minutes
    default: 30
  },
  actualTime: Number,
  notes: {
    type: String,
    maxlength: 1000
  },
  preparedAt: Date,
  servedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ tableId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ waiterUserId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ waiterUserId: 1, status: 1 });

// Static method to generate order number
orderSchema.statics.generateOrderNumber = function() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${randomStr}`;
};

// Pre-save middleware to auto-generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    let orderNumber;
    let exists = true;
    
    // Keep generating until we find a unique number
    while (exists) {
      orderNumber = this.constructor.generateOrderNumber();
      exists = await this.constructor.findOne({ orderNumber });
    }
    
    this.orderNumber = orderNumber;
  }
  next();
});

// Update timestamps on status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'preparing' && !this.preparedAt) {
      this.preparedAt = new Date();
    } else if (this.status === 'served' && !this.servedAt) {
      this.servedAt = new Date();
    } else if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
      this.paymentStatus = 'paid';
      
      // Calculate actual time
      if (this.createdAt) {
        this.actualTime = Math.floor((this.completedAt - this.createdAt) / 1000 / 60);
      }
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
