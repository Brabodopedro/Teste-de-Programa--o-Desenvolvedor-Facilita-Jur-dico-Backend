const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');  // Adicione esta linha

const app = express();
const port = 3001;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste',
    password: 'Pedrobara@1',
    port: 5432,
});

app.use(bodyParser.json());
app.use(cors());  // Adicione esta linha

// Restante do seu código...

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
app.get('/clientes', async (req, res) => {
    try {
        let query = 'SELECT * FROM clientes';
        const { nome, email, telefone } = req.query;

        // Verificar se há parâmetros de filtro na consulta
        const filterParams = { nome, email, telefone };
        const filterConditions = Object.entries(filterParams)
            .filter(([key, value]) => value)
            .map(([key, value]) => `${key} ILIKE $${key}`)
            .join(' AND ');

        if (filterConditions) {
            query += ' WHERE ' + filterConditions;
        }

        const result = await pool.query(query, Object.values(filterParams).map(value => `%${value}%`));
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
app.post('/clientes', async (req, res) => {
    try {
        console.log('Recebendo requisição para cadastrar cliente:', req.body);
        const { nome, email, telefone } = req.body;
        const result = await pool.query('INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *', [nome, email, telefone]);
        console.log('Cliente cadastrado com sucesso:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
