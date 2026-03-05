const express = require('express');
const router = express.Router();
const KitchenOrder = require('../models/KitchenOrder');
const Table = require('../models/Table');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST /kitchen/order - create new kitchen order
router.post('/kitchen/order', authenticateToken, requireRole('worker', 'owner'), async (req, res) => {
    try {
        const { tableNumber, items } = req.body;
        const order = await KitchenOrder.create({
            tableNumber,
            items,
            workerEmail: req.user.email,
            workerName: req.user.name,
            status: 'pending'
        });

        await Table.findOneAndUpdate(
            { tableNumber },
            { status: 'occupied', currentOrder: order._id }
        );

        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// GET /kitchen/orders - get all pending/preparing orders
router.get('/kitchen/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await KitchenOrder.find({
            status: { $in: ['pending', 'preparing', 'ready'] }
        }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// PUT /kitchen/orders/:id/status - update order status
router.put('/kitchen/orders/:id/status', authenticateToken, requireRole('worker', 'owner'), async (req, res) => {
    try {
        const { status } = req.body;
        const order = await KitchenOrder.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, errors: 'Order not found' });
        }

        if (status === 'served') {
            await Table.findOneAndUpdate(
                { tableNumber: order.tableNumber },
                { status: 'available', currentOrder: null }
            );
        }

        res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// GET /kitchen/orders/history - get served order history
router.get('/kitchen/orders/history', authenticateToken, async (req, res) => {
    try {
        const orders = await KitchenOrder.find({ status: 'served' }).sort({ updatedAt: -1 }).limit(100);
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

module.exports = router;
