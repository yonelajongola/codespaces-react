const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /inventory - get all inventory items (owner only)
router.get('/inventory', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const items = await Inventory.find().sort({ name: 1 });
        res.json({ success: true, items });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// POST /inventory - add inventory item (owner only)
router.post('/inventory', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        res.json({ success: true, item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// PUT /inventory/:id - update inventory item (owner only)
router.put('/inventory/:id', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ success: false, errors: 'Inventory item not found' });
        }
        res.json({ success: true, item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// DELETE /inventory/:id - delete inventory item (owner only)
router.delete('/inventory/:id', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, errors: 'Inventory item not found' });
        }
        res.json({ success: true, message: 'Inventory item deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

module.exports = router;
