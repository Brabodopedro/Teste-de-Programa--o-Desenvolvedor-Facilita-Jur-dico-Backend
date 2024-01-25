const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste',
    password: 'Pedrobara@1',
    port: 5432,
});

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// Rotas para manipular clientes
app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        console.log('Dados buscados com sucesso:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const { nome, email, telefone, casa, x, y } = req.body;
        const result = await pool.query('INSERT INTO clientes (nome, email, telefone, casa, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nome, email, telefone, casa, x, y]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
