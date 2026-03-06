const express = require('express');

const router = express.Router();

function normalize(text) {
  return String(text || '').toLowerCase().trim();
}

function buildSuggestions(items) {
  return [...items]
    .sort((a, b) => (parseInt(a.price || 0, 10) || 0) - (parseInt(b.price || 0, 10) || 0))
    .slice(0, 3)
    .map((item) => item.name);
}

router.post('/ai-waiter/query', (req, res) => {
  const query = normalize(req.body?.query);
  const allItems = Array.isArray(global.itemData) ? global.itemData : [];
  const categories = Array.isArray(global.foodCategory) ? global.foodCategory : [];

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const response = {
    mode: 'AI',
    reply: 'AI-WAITER is ready. Ask me to search menu, recommend food, or open your cart.',
    action: null,
    searchTerm: null,
    suggestions: []
  };

  if (query.includes('open cart') || query === 'cart' || query.includes('go to cart')) {
    response.reply = 'Opening your cart now.';
    response.action = 'navigate';
    response.searchTerm = '/cart';
    return res.json(response);
  }

  if (query.includes('my order') || query.includes('orders')) {
    response.reply = 'Opening your order page.';
    response.action = 'navigate';
    response.searchTerm = '/myOrder';
    return res.json(response);
  }

  if (query.includes('show all') || query.includes('clear search')) {
    response.reply = 'Showing the full menu in AI mode.';
    response.action = 'search';
    response.searchTerm = '';
    return res.json(response);
  }

  if (query.includes('recommend') || query.includes('suggest')) {
    const picks = buildSuggestions(allItems);
    response.reply = picks.length
      ? `AI recommendations: ${picks.join(', ')}.`
      : 'I could not find menu items yet. Please try again in a moment.';
    response.action = 'recommend';
    response.suggestions = picks;
    return res.json(response);
  }

  const requestedCategory = categories.find((cat) =>
    query.includes(normalize(cat.CategoryName))
  );

  if (requestedCategory) {
    response.reply = `Showing ${requestedCategory.CategoryName} in AI mode.`;
    response.action = 'search';
    response.searchTerm = requestedCategory.CategoryName;
    return res.json(response);
  }

  const searchMatch = query.match(/(?:search|find|look for)\s+(.+)/);
  if (searchMatch && searchMatch[1]) {
    const term = searchMatch[1].trim();
    response.reply = `Searching for ${term} in AI mode.`;
    response.action = 'search';
    response.searchTerm = term;
    return res.json(response);
  }

  response.reply = 'Try: search burger, recommend, open cart, or show all.';
  return res.json(response);
});

module.exports = router;
