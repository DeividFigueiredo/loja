/**
 * Frontend — servidor estático, porta 5000.
 *
 * Em desenvolvimento: use `npm run dev` (Vite)
 * Em produção: `npm run build` depois `npm start`
 *
 * Serve os arquivos de `public/` (build do Vite).
 * Toda lógica de dados passa pelo Gateway em http://localhost:3000.
 */
require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend em http://localhost:${PORT}`);
});
