# Azure Backend Configuration Guide

## Environment Variables for Production

Create a `.env` file in the `restaurant-backend` directory with the following variables:

### Database Configuration
```env
# MongoDB Connection String
# Get from MongoDB Atlas → Connect → Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_management?retryWrites=true&w=majority

# Database Name
DATABASE_NAME=restaurant_management
```

### Server Configuration
```env
# Node Environment
NODE_ENV=production

# Server Port (Azure sets this automatically)
PORT=8080

# Server Host
HOST=0.0.0.0
```

### Authentication & Security
```env
# JWT Secret (Generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-jwt-secret-here

# JWT Expiration
JWT_EXPIRES_IN=7d

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=10
```

### Azure OpenAI Configuration
```env
# Azure OpenAI Endpoint
# Format: https://{resource-name}.openai.azure.com/
AZURE_OPENAI_ENDPOINT=https://restaurant-openai.openai.azure.com/

# Azure OpenAI API Key
AZURE_OPENAI_KEY=your-openai-key-here

# Azure OpenAI Deployment Name
AZURE_OPENAI_DEPLOYMENT=gpt-4

# Azure OpenAI API Version
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### API Configuration
```env
# API Base URL (for frontend communication)
API_BASE_URL=https://restaurant-api-dev-xxxxx.azurewebsites.net

# Frontend URL (for CORS)
FRONTEND_URL=https://restaurant-dashboard-dev-xxxxx.azurestaticapps.net

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Logging Configuration
```env
# Log Level (error, warn, info, debug)
LOG_LEVEL=info

# Log Format (json, text)
LOG_FORMAT=json

# Application Insights Connection String (if enabled)
APPINSIGHTS_INSTRUMENTATION_KEY=your-app-insights-key
```

### Feature Flags
```env
# Enable AI Features
ENABLE_AI_FEATURES=true

# Enable AI Waiter
ENABLE_AI_WAITER=true

# Enable Document Intelligence
ENABLE_DOCUMENT_INTELLIGENCE=true
```

---

## Azure App Service Configuration

### App Settings via Azure CLI

```bash
# Set multiple environment variables
az webapp config appsettings set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    JWT_SECRET="@JWT-Secret" \
    MONGODB_URI="@MongoDB-URI" \
    AZURE_OPENAI_ENDPOINT="@OpenAI-Endpoint" \
    AZURE_OPENAI_KEY="@OpenAI-Key"
```

### Key Vault References

Use Key Vault references in App Service settings to keep secrets secure:

```bash
# Format: @Microsoft.KeyVault(SecretUri=https://vault-name.vault.azure.net/secrets/secret-name/)

# Example
az webapp config appsettings set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings \
    "MONGODB_URI=@Microsoft.KeyVault(SecretUri=https://restaurant-kv-dev-xxxxx.vault.azure.net/secrets/mongodb-uri/)"
```

### Connection Strings

```bash
# Add MongoDB connection string
az webapp config connection-string set \
  --resource-group restaurant-rg \
  --name restaurant-api-dev-xxxxx \
  --settings DefaultConnection=\
"mongodb+srv://username:password@cluster.mongodb.net/restaurant_management" \
  --connection-string-type MongoDBAtlas
```

---

## Backend Server Implementation

### Express Server Setup (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Environment variables
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.error('✗ MongoDB error:', err.message));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Liveness Probe (for Azure health checks)
app.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness Probe
app.get('/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/restaurant', require('./routes/restaurant'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log(`✓ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Pending'}`);
});
```

---

## Authentication Middleware

### JWT Verification (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

---

## Database Schema Configuration

### MongoDB Connection Settings

```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4 for Azure compatibility
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Azure OpenAI Integration

### AI Service Configuration (services/aiService.js)

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

class AIService {
  constructor() {
    this.client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );
    this.deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT;
  }

  async generateAIResponse(messages) {
    try {
      const response = await this.client.getChatCompletions(
        this.deploymentId,
        messages,
        {
          temperature: 0.7,
          maxTokens: 1000,
          topP: 0.95
        }
      );

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeImage(imageUrl) {
    // Image analysis implementation
    try {
      const response = await this.client.getChatCompletions(
        this.deploymentId,
        [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this restaurant order image:" },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      );

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
```

---

## Monitoring & Logging

### Application Insights Integration

```javascript
const AppInsights = require('applicationinsights');

// Initialize Application Insights
if (process.env.APPINSIGHTS_INSTRUMENTATION_KEY) {
  AppInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATION_KEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectConsole(true)
    .start();

  const client = AppInsights.defaultClient;
  
  // Log custom events
  client.trackEvent({ name: 'Server Started' });
  client.trackTrace({ 
    message: 'Application Insights enabled',
    severityLevel: 1
  });
}
```

### Structured Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT === 'json'
    ? winston.format.json()
    : winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

---

## Performance Optimization

### Connection Pooling

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

### Caching Strategy

```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache middleware
const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    const key = `${req.method}${req.originalUrl}`;
    
    client.get(key, (err, data) => {
      if (data) {
        res.send(JSON.parse(data));
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          client.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};
```

---

## Security Best Practices

### HTTPS Enforcement

```javascript
// Already enforced by Azure App Service
// But can be explicitly set:
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}));
```

### Input Validation

```javascript
const { body, validationResult } = require('express-validator');

const validateRequest = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

---

## Deployment Considerations

### Package.json Dependencies

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "cors": "^2.8.5",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "dotenv": "^16.0.0",
    "@azure/openai": "^1.0.0",
    "applicationinsights": "^2.4.0",
    "express-rate-limit": "^7.0.0"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

### Build & Deployment Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Build complete'",
    "deploy:azure": "npm install && npm start",
    "test": "jest"
  }
}
```

---

## Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| MongoDB Connection Timeout | MongoDB Atlas network access not configured | Add 0.0.0.0/0 or Azure IPs to Network Access |
| 503 Service Unavailable | App Service still initializing | Wait 2-5 minutes and retry |
| CORS Errors | Frontend URL not in CORS whitelist | Update FRONTEND_URL in app settings |
| OpenAI API Errors | Invalid endpoint or key | Verify credentials in Key Vault |
| JWT Verification Failed | JWT_SECRET mismatch | Ensure same secret in backend and frontend |

---

## Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Atlas Connection Guide](https://docs.mongodb.com/guides/server/drivers/)
- [Azure OpenAI Service Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)

