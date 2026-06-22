const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const apiHandler = require('./api/index.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Servir HTML
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'GeoRadar-Agro-Advanced.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send('HTML não encontrado');
  }
});

// Rotas da API
app.all('*', (req, res) => {
  apiHandler(req, res);
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ GeoRadar Agro rodando em http://localhost:${PORT}`);
    console.log(`📊 Acesse: http://localhost:${PORT}`);
  });
}

// Para Vercel (serverless)
module.exports = app;
