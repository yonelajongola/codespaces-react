const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /tables - get all tables
router.get('/tables', authenticateToken, async (req, res) => {
    try {
        const tables = await Table.find().populate('currentOrder');
        res.json({ success: true, tables });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// PUT /tables/:id/status - update table status
router.put('/tables/:id/status', authenticateToken, requireRole('worker', 'owner'), async (req, res) => {
    try {
        const { status } = req.body;
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!table) {
            return res.status(404).json({ success: false, errors: 'Table not found' });
        }
        res.json({ success: true, table });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// POST /tables/seed - seed initial tables (owner only)
router.post('/tables/seed', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const count = req.body.count || 10;
        await Table.deleteMany({});
        const tables = [];
        for (let i = 1; i <= count; i++) {
            tables.push({ tableNumber: i, status: 'available', capacity: 4 });
        }
        await Table.insertMany(tables);
        res.json({ success: true, message: `${count} tables seeded successfully` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

module.exports = router;
