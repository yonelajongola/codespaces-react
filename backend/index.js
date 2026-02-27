const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');

const port = process.env.PORT || 3000;

if (!process.env.NETLIFY) {
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
}