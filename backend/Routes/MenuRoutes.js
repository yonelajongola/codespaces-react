const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { authenticateToken, requireRole } = require('../middleware/auth');

// GET /menu - get all available menu items (public)
router.get('/menu', async (req, res) => {
    try {
        const items = await MenuItem.find({ available: true });
        res.json({ success: true, items });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// POST /menu - create menu item (owner only)
router.post('/menu', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        res.json({ success: true, item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// PUT /menu/:id - update menu item (owner only)
router.put('/menu/:id', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ success: false, errors: 'Menu item not found' });
        }
        res.json({ success: true, item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// DELETE /menu/:id - delete menu item (owner only)
router.delete('/menu/:id', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, errors: 'Menu item not found' });
        }
        res.json({ success: true, message: 'Menu item deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

module.exports = router;
