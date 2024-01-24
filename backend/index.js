const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'seu_banco_de_dados',
    password: 'sua_senha',
    port: 5432,
});

app.use(bodyParser.json());

// Rotas para manipular clientes
app.get('/clientes', async (req, res) => {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
});

app.post('/clientes', async (req, res) => {
    const { nome, email, telefone } = req.body;
    const result = await pool.query('INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *', [nome, email, telefone]);
    res.json(result.rows[0]);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
