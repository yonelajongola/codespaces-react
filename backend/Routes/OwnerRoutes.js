const express = require('express');
const router = express.Router();
const KitchenOrder = require('../models/KitchenOrder');
const Table = require('../models/Table');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /owner/analytics - sales summary
router.get('/owner/analytics', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const allServed = await KitchenOrder.find({ status: 'served' });
        const totalRevenue = allServed.reduce((sum, order) => {
            return sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0);
        }, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = allServed.filter(o => new Date(o.updatedAt) >= today);

        const activeTables = await Table.countDocuments({ status: 'occupied' });

        res.json({
            success: true,
            analytics: {
                totalRevenue: totalRevenue.toFixed(2),
                totalOrders: allServed.length,
                ordersToday: todayOrders.length,
                avgOrderValue: allServed.length ? (totalRevenue / allServed.length).toFixed(2) : '0.00',
                activeTables
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// GET /owner/revenue/daily - revenue by day (last 30 days)
router.get('/owner/revenue/daily', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await KitchenOrder.find({
            status: 'served',
            updatedAt: { $gte: thirtyDaysAgo }
        });

        const revenueMap = {};
        orders.forEach(order => {
            const date = new Date(order.updatedAt).toISOString().split('T')[0];
            const orderTotal = order.items.reduce((s, item) => s + item.price * item.quantity, 0);
            revenueMap[date] = (revenueMap[date] || 0) + orderTotal;
        });

        const daily = Object.entries(revenueMap)
            .map(([date, revenue]) => ({ date, revenue: parseFloat(revenue.toFixed(2)) }))
            .sort((a, b) => a.date.localeCompare(b.date));

        res.json({ success: true, daily });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// GET /owner/top-dishes - top selling dishes
router.get('/owner/top-dishes', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const orders = await KitchenOrder.find({ status: 'served' });
        const dishMap = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (!dishMap[item.name]) {
                    dishMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                dishMap[item.name].quantity += item.quantity;
                dishMap[item.name].revenue += item.price * item.quantity;
            });
        });

        const topDishes = Object.values(dishMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)
            .map(d => ({ ...d, revenue: parseFloat(d.revenue.toFixed(2)) }));

        res.json({ success: true, topDishes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// GET /owner/staff-performance - orders per worker
router.get('/owner/staff-performance', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const orders = await KitchenOrder.find({ status: 'served' });
        const staffMap = {};

        orders.forEach(order => {
            const key = order.workerEmail || 'unknown';
            if (!staffMap[key]) {
                staffMap[key] = { email: key, name: order.workerName || key, orders: 0, revenue: 0 };
            }
            staffMap[key].orders += 1;
            staffMap[key].revenue += order.items.reduce((s, item) => s + item.price * item.quantity, 0);
        });

        const staff = Object.values(staffMap)
            .sort((a, b) => b.orders - a.orders)
            .map(s => ({ ...s, revenue: parseFloat(s.revenue.toFixed(2)) }));

        res.json({ success: true, staff });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

module.exports = router;
