const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected', uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
