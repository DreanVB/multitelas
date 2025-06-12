const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

const config = {
  user: 'Sa',
  password: 'P@ssw0rd2023@#$',
  server: '192.168.1.43', // ex: 'localhost'
  database: 'SOUTTOMAYOR',
  options: { encrypt: false, trustServerCertificate: true }
};

app.get('/api/produtos', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("select DESCRICAO, VALIDADE, TPVALIDADE from TPAPRODUTO where IDX_NEGOCIO = 'Produtos acabados' ORDER BY DESCRICAO");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('API rodando na porta 4000'));