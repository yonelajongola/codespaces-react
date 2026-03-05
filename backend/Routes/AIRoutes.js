const express = require('express');
const router = express.Router();
const KitchenOrder = require('../models/KitchenOrder');
const { authenticateToken, requireRole } = require('../middleware/auth');

// POST /ai/demand-prediction - predict busy hours based on order history
router.post('/ai/demand-prediction', authenticateToken, requireRole('owner'), async (req, res) => {
    try {
        const orders = await KitchenOrder.find({ status: 'served' });

        const hourCounts = Array(24).fill(0);
        orders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourCounts[hour]++;
        });

        const maxCount = Math.max(...hourCounts, 1);
        const predictions = hourCounts.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            predicted: count,
            confidence: parseFloat((count / maxCount).toFixed(2)),
            label: count > maxCount * 0.7 ? 'High' : count > maxCount * 0.4 ? 'Medium' : 'Low'
        }));

        res.json({
            success: true,
            predictions,
            summary: {
                peakHour: `${hourCounts.indexOf(Math.max(...hourCounts)).toString().padStart(2, '0')}:00`,
                totalOrdersAnalyzed: orders.length
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, errors: 'Server error' });
    }
});

// POST /ai/menu-generator - generate menu suggestions
router.post('/ai/menu-generator', authenticateToken, requireRole('owner'), async (req, res) => {
    const { category = 'Main Course', cuisine = 'International', preferences = '' } = req.body;

    const suggestions = {
        'Main Course': [
            { name: 'Grilled Salmon with Lemon Butter', description: 'Fresh Atlantic salmon grilled to perfection', price: 24.99, category: 'Main Course' },
            { name: 'Beef Tenderloin Medallions', description: 'Pan-seared beef with red wine reduction', price: 32.99, category: 'Main Course' },
            { name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms', price: 18.99, category: 'Main Course' },
            { name: 'Roasted Chicken Supreme', description: 'Free-range chicken with herb stuffing', price: 22.99, category: 'Main Course' }
        ],
        'Starter': [
            { name: 'Bruschetta al Pomodoro', description: 'Toasted bread with tomatoes and basil', price: 9.99, category: 'Starter' },
            { name: 'Soup of the Day', description: "Chef's daily fresh-made soup", price: 7.99, category: 'Starter' },
            { name: 'Shrimp Cocktail', description: 'Chilled shrimp with zesty cocktail sauce', price: 14.99, category: 'Starter' }
        ],
        'Dessert': [
            { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 8.99, category: 'Dessert' },
            { name: 'Crème Brûlée', description: 'Classic French vanilla custard', price: 7.99, category: 'Dessert' },
            { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 7.99, category: 'Dessert' }
        ],
        'Beverage': [
            { name: 'Fresh Squeezed Orange Juice', description: 'Made to order', price: 5.99, category: 'Beverage' },
            { name: 'House Blend Coffee', description: 'Freshly brewed premium coffee', price: 3.99, category: 'Beverage' },
            { name: 'Sparkling Lemonade', description: 'House-made with fresh lemons', price: 4.99, category: 'Beverage' }
        ]
    };

    const items = suggestions[category] || suggestions['Main Course'];

    res.json({
        success: true,
        suggestions: items,
        metadata: { category, cuisine, preferences, generatedAt: new Date().toISOString() }
    });
});

// POST /ai/receipt-scan - process receipt image (Azure Document Intelligence stub)
router.post('/ai/receipt-scan', authenticateToken, requireRole('owner'), async (req, res) => {
    res.json({
        success: true,
        extractedData: {
            vendor: 'Fresh Produce Co.',
            date: new Date().toISOString().split('T')[0],
            total: 245.80,
            items: [
                { description: 'Tomatoes (5kg)', quantity: 5, unitPrice: 3.50, total: 17.50 },
                { description: 'Lettuce (10 heads)', quantity: 10, unitPrice: 1.20, total: 12.00 },
                { description: 'Chicken Breast (10kg)', quantity: 10, unitPrice: 8.99, total: 89.90 },
                { description: 'Olive Oil (5L)', quantity: 2, unitPrice: 18.50, total: 37.00 },
                { description: 'Pasta (2kg)', quantity: 4, unitPrice: 3.20, total: 12.80 }
            ],
            confidence: 0.94,
            note: 'Stub response — Azure Document Intelligence integration pending'
        }
    });
});

module.exports = router;
