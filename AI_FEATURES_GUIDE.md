# AI Features Integration Guide

## 🤖 Overview

This restaurant management system integrates three powerful Azure AI services:

1. **Azure OpenAI Service** - Demand prediction, menu generation, customer insights
2. **Azure Document Intelligence** - Receipt scanning and invoice processing
3. **Azure AI Analytics** - Pattern recognition and business insights

---

## 🔧 Azure Services Setup

### 1. Azure OpenAI Service

**Purpose**: Generate AI-powered insights, predict demand, and create menu suggestions

**Setup Steps:**

```bash
# 1. Create Azure OpenAI resource
az cognitiveservices account create \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# 2. Get API key
az cognitiveservices account keys list \
  --name restaurant-openai \
  --resource-group restaurant-rg

# 3. Deploy GPT-4 model
az cognitiveservices account deployment create \
  --name restaurant-openai \
  --resource-group restaurant-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard
```

**Environment Variables:**
```env
AZURE_OPENAI_ENDPOINT=https://restaurant-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

### 2. Azure Document Intelligence

**Purpose**: Extract structured data from receipts, invoices, and documents

**Setup Steps:**

```bash
# 1. Create Document Intelligence resource
az cognitiveservices account create \
  --name restaurant-doc-intelligence \
  --resource-group restaurant-rg \
  --kind FormRecognizer \
  --sku S0 \
  --location eastus

# 2. Get API key
az cognitiveservices account keys list \
  --name restaurant-doc-intelligence \
  --resource-group restaurant-rg
```

**Environment Variables:**
```env
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://restaurant-doc-intelligence.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-key-here
```

---

## 📦 Node.js Dependencies

```bash
npm install @azure/openai @azure/ai-form-recognizer axios
```

**Package.json additions:**
```json
{
  "dependencies": {
    "@azure/openai": "^1.0.0-beta.11",
    "@azure/ai-form-recognizer": "^5.0.0",
    "axios": "^1.6.0"
  }
}
```

---

## 🚀 Feature 1: Demand Prediction

### AI Service Implementation

**File**: `/backend/services/demandPredictor.js`

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const Order = require("../models/Order");

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

async function predictDemand(date, analysisType = 'hourly') {
  try {
    // Get historical data (last 30 days)
    const thirtyDaysAgo = new Date(date);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo, $lte: new Date(date) },
      status: 'completed'
    }).select('createdAt total items tableNumber orderType');
    
    // Prepare data for AI analysis
    const historicalData = prepareHistoricalData(orders, date);
    
    // Create prompt for Azure OpenAI
    const prompt = `
You are an AI restaurant analytics expert. Analyze the following historical order data and predict demand for ${date}.

Historical Data (Last 30 Days):
${JSON.stringify(historicalData, null, 2)}

Target Date: ${date} (${getDayOfWeek(date)})

Provide a detailed prediction including:
1. Estimated number of orders per hour (11am-11pm)
2. Peak hours (busiest times)
3. Recommended staffing levels
4. Popular items likely to be ordered
5. Confidence level for predictions

Return your response in JSON format with the following structure:
{
  "estimatedOrders": number,
  "busyHours": [hours],
  "peakTime": "HH:00",
  "recommendedStaffing": {
    "waiters": number,
    "cooks": number,
    "total": number
  },
  "hourlyForecast": [
    { "hour": 12, "estimatedOrders": 18, "confidence": 85 }
  ],
  "insights": ["insight1", "insight2"]
}
`;

    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        { role: "system", content: "You are a restaurant analytics AI assistant." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.7,
        maxTokens: 1500
      }
    );
    
    const prediction = JSON.parse(response.choices[0].message.content);
    
    return {
      date,
      predictions: prediction,
      dataSource: `${orders.length} historical orders analyzed`
    };
    
  } catch (error) {
    console.error('Error predicting demand:', error);
    throw error;
  }
}

function prepareHistoricalData(orders, targetDate) {
  const dayOfWeek = getDayOfWeek(targetDate);
  
  // Group orders by hour and day type (weekend vs weekday)
  const hourlyStats = {};
  
  orders.forEach(order => {
    const hour = order.createdAt.getHours();
    const isWeekend = [0, 6].includes(order.createdAt.getDay());
    const targetIsWeekend = [0, 6].includes(new Date(targetDate).getDay());
    
    // Only consider similar day types
    if (isWeekend === targetIsWeekend) {
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { count: 0, revenue: 0, items: 0 };
      }
      
      hourlyStats[hour].count++;
      hourlyStats[hour].revenue += order.total;
      hourlyStats[hour].items += order.items.length;
    }
  });
  
  return {
    dayOfWeek,
    isWeekend: [0, 6].includes(new Date(targetDate).getDay()),
    hourlyStats,
    totalOrders: orders.length,
    averageOrderValue: orders.reduce((sum, o) => sum + o.total, 0) / orders.length
  };
}

function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

module.exports = { predictDemand };
```

### API Endpoint

**Route**: `POST /api/ai/predict-demand`

**Controller**: `/backend/controllers/aiController.js`

```javascript
const { predictDemand } = require('../services/demandPredictor');

exports.predictDemand = async (req, res) => {
  try {
    const { date, analysisType } = req.body;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }
    
    const predictions = await predictDemand(date, analysisType);
    
    res.json({
      success: true,
      data: predictions
    });
  } catch (error) {
    console.error('Error in predictDemand:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate demand prediction',
      error: error.message
    });
  }
};
```

---

## 🍽️ Feature 2: AI Menu Generator

### Service Implementation

**File**: `/backend/services/menuGenerator.js`

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

async function generateMenuItems(options) {
  const { category, cuisine, dietaryRestrictions, count = 3 } = options;
  
  try {
    const prompt = `
You are a professional chef and menu designer. Generate ${count} creative and appealing menu items.

Requirements:
- Category: ${category}
- Cuisine: ${cuisine || 'Any'}
- Dietary Restrictions: ${dietaryRestrictions?.join(', ') || 'None'}

For each menu item, provide:
1. Creative but marketable name
2. Appetizing description (20-30 words)
3. Suggested price (reasonable for a mid-range restaurant)
4. Main ingredients (5-7 items)
5. Estimated preparation time (in minutes)
6. Allergen information
7. Nutritional highlights

Return as JSON array:
[
  {
    "name": "Dish Name",
    "description": "Appetizing description",
    "suggestedPrice": 24.99,
    "ingredients": ["ingredient1", "ingredient2"],
    "preparationTime": 25,
    "allergens": ["allergen1"],
    "nutritionalHighlights": "High protein, low carb",
    "category": "${category}"
  }
]
`;

    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        { role: "system", content: "You are a professional chef and culinary expert." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.9, // Higher creativity
        maxTokens: 2000
      }
    );
    
    const generatedItems = JSON.parse(response.choices[0].message.content);
    
    return generatedItems;
    
  } catch (error) {
    console.error('Error generating menu:', error);
    throw error;
  }
}

module.exports = { generateMenuItems };
```

### API Endpoint

```javascript
const { generateMenuItems } = require('../services/menuGenerator');

exports.generateMenu = async (req, res) => {
  try {
    const options = req.body;
    
    const generatedItems = await generateMenuItems(options);
    
    res.json({
      success: true,
      data: {
        generatedItems
      }
    });
  } catch (error) {
    console.error('Error in generateMenu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate menu items',
      error: error.message
    });
  }
};
```

---

## 📄 Feature 3: Receipt Scanner

### Service Implementation

**File**: `/backend/services/receiptScanner.js`

```javascript
const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require('fs');

const client = new DocumentAnalysisClient(
  process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY)
);

async function scanReceipt(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Use prebuilt receipt model
    const poller = await client.beginAnalyzeDocument("prebuilt-receipt", fileBuffer);
    const result = await poller.pollUntilDone();
    
    if (!result.documents || result.documents.length === 0) {
      throw new Error('No receipt data found in image');
    }
    
    const receipt = result.documents[0];
    const fields = receipt.fields;
    
    // Extract structured data
    const extractedData = {
      vendor: fields.MerchantName?.content || 'Unknown',
      date: fields.TransactionDate?.content || null,
      invoiceNumber: fields.InvoiceId?.content || null,
      items: [],
      subtotal: fields.Subtotal?.value || 0,
      tax: fields.TotalTax?.value || 0,
      total: fields.Total?.value || 0,
      confidence: receipt.confidence * 100
    };
    
    // Extract line items
    if (fields.Items?.values) {
      extractedData.items = fields.Items.values.map(item => ({
        name: item.properties.Description?.content || 'Unknown Item',
        quantity: item.properties.Quantity?.value || 1,
        unitPrice: item.properties.Price?.value || 0,
        total: item.properties.TotalPrice?.value || 0
      }));
    }
    
    return extractedData;
    
  } catch (error) {
    console.error('Error scanning receipt:', error);
    throw error;
  }
}

// Alternative: Use invoice model for supplier invoices
async function scanInvoice(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const poller = await client.beginAnalyzeDocument("prebuilt-invoice", fileBuffer);
    const result = await poller.pollUntilDone();
    
    if (!result.documents || result.documents.length === 0) {
      throw new Error('No invoice data found');
    }
    
    const invoice = result.documents[0];
    const fields = invoice.fields;
    
    return {
      vendor: fields.VendorName?.content,
      vendorAddress: fields.VendorAddress?.content,
      invoiceNumber: fields.InvoiceId?.content,
      invoiceDate: fields.InvoiceDate?.content,
      dueDate: fields.DueDate?.content,
      items: fields.Items?.values?.map(item => ({
        description: item.properties.Description?.content,
        quantity: item.properties.Quantity?.value,
        unit: item.properties.Unit?.content,
        unitPrice: item.properties.UnitPrice?.value,
        amount: item.properties.Amount?.value
      })),
      subtotal: fields.SubTotal?.value,
      tax: fields.TotalTax?.value,
      total: fields.InvoiceTotal?.value,
      confidence: invoice.confidence * 100
    };
    
  } catch (error) {
    console.error('Error scanning invoice:', error);
    throw error;
  }
}

module.exports = { scanReceipt, scanInvoice };
```

### API Endpoint with File Upload

```javascript
const multer = require('multer');
const { scanReceipt, scanInvoice } = require('../services/receiptScanner');

// Configure multer for file upload
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

exports.scanReceiptEndpoint = [
  upload.single('receipt'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      const extractedData = await scanReceipt(req.file.path);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({
        success: true,
        data: extractedData
      });
    } catch (error) {
      console.error('Error in scanReceipt:', error);
      
      // Clean up file on error
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to scan receipt',
        error: error.message
      });
    }
  }
];
```

---

## 💡 Feature 4: AI Insights

### Service Implementation

**File**: `/backend/services/aiInsights.js`

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const MenuItem = require("../models/MenuItem");

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

async function generateInsights() {
  try {
    // Gather recent data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [orders, lowStockItems, topMenuItems] = await Promise.all([
      Order.find({ 
        createdAt: { $gte: sevenDaysAgo },
        status: 'completed'
      }).countDocuments(),
      
      Inventory.find({ status: 'low-stock' }).countDocuments(),
      
      MenuItem.find({ availability: true })
        .sort({ soldCount: -1 })
        .limit(5)
        .select('name soldCount')
    ]);
    
    // Get day of week pattern
    const dayPattern = await analyzeDayPattern();
    
    const prompt = `
You are a restaurant business analyst AI. Analyze this data and provide 3-5 actionable insights.

Recent Data:
- Orders last 7 days: ${orders}
- Low stock items: ${lowStockItems}
- Top selling items: ${JSON.stringify(topMenuItems)}
- Busiest days: ${dayPattern.busiestDays.join(', ')}

Provide insights in JSON format:
[
  {
    "type": "demand|inventory|menu|staff|revenue",
    "title": "Brief title (5-7 words)",
    "message": "Detailed explanation (15-20 words)",
    "action": "Recommended action (10-15 words)",
    "priority": "high|medium|low"
  }
]

Focus on actionable insights that can improve operations or revenue.
`;

    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [
        { role: "system", content: "You are a restaurant business intelligence analyst." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.7,
        maxTokens: 1000
      }
    );
    
    const insights = JSON.parse(response.choices[0].message.content);
    
    return {
      insights,
      generatedAt: new Date()
    };
    
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

async function analyzeDayPattern() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const orders = await Order.find({
    createdAt: { $gte: thirtyDaysAgo },
    status: 'completed'
  }).select('createdAt total');
  
  const dayStats = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  orders.forEach(order => {
    const day = days[order.createdAt.getDay()];
    if (!dayStats[day]) {
      dayStats[day] = { orders: 0, revenue: 0 };
    }
    dayStats[day].orders++;
    dayStats[day].revenue += order.total;
  });
  
  const sortedDays = Object.entries(dayStats)
    .sort((a, b) => b[1].orders - a[1].orders)
    .map(([day]) => day);
  
  return {
    busiestDays: sortedDays.slice(0, 3),
    slowestDays: sortedDays.slice(-3)
  };
}

module.exports = { generateInsights };
```

---

## 🔐 Security Best Practices

### 1. Store API Keys in Azure Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name restaurant-keyvault \
  --resource-group restaurant-rg \
  --location eastus

# Store secrets
az keyvault secret set \
  --vault-name restaurant-keyvault \
  --name "OpenAI-API-Key" \
  --value "your-api-key"

az keyvault secret set \
  --vault-name restaurant-keyvault \
  --name "Document-Intelligence-Key" \
  --value "your-key"
```

### 2. Access Secrets in Node.js

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
const client = new SecretClient(
  process.env.KEY_VAULT_URL,
  credential
);

async function getSecret(secretName) {
  const secret = await client.getSecret(secretName);
  return secret.value;
}
```

---

## 💰 Cost Optimization

### Azure OpenAI Pricing
- GPT-4: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)
- **Recommendation**: Use GPT-3.5-Turbo for routine tasks, GPT-4 for complex analysis

### Document Intelligence Pricing
- Receipt processing: $0.01 per page
- Invoice processing: $0.015 per page

### Cost-Saving Tips
1. Cache AI responses for repeated queries
2. Batch process receipts during off-peak hours
3. Use rate limiting to control API usage
4. Implement token usage monitoring

---

## 📊 Monitoring & Analytics

### Track AI Usage

```javascript
const AIUsageLog = new mongoose.Schema({
  feature: String,
  userId: mongoose.Schema.Types.ObjectId,
  tokensUsed: Number,
  cost: Number,
  responseTime: Number,
  timestamp: { type: Date, default: Date.now }
});
```

### Monitor with Azure Application Insights

```javascript
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
appInsights.start();

const client = appInsights.defaultClient;
client.trackEvent({ name: "AI_DemandPrediction", properties: { date: targetDate } });
```

---

## 🧪 Testing

### Test Demand Prediction

```javascript
const { predictDemand } = require('./services/demandPredictor');

async function testDemandPrediction() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const prediction = await predictDemand(tomorrow.toISOString().split('T')[0]);
  console.log('Prediction:', JSON.stringify(prediction, null, 2));
}
```

### Test Receipt Scanner

```bash
curl -X POST http://localhost:5000/api/ai/scan-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "receipt=@test-receipt.jpg"
```

---

## 📚 Additional Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)
- [OpenAI Node.js SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)

---

**Last Updated**: March 6, 2026
**Version**: 1.0
