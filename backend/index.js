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

// Exporta as funções para serem utilizadas em outros módulos
module.exports = {
    encontrarPontoMaisProximo,
    calcularDistancia,
    calcularMenorRota,
};

// Função para encontrar o ponto mais próximo
function encontrarPontoMaisProximo(pontoAtual, coordenadas, ordemDeVisita, casasSelecionadas) {
    let pontoMaisProximo = -1;
    let menorDistancia = Infinity;

    coordenadas.forEach((ponto, index) => {
        if (!ordemDeVisita.includes(index) && casasSelecionadas.includes(Number(ponto.casa))) {
            const distancia = calcularDistancia(pontoAtual, ponto);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                pontoMaisProximo = index;
            }
        }
    });

    return pontoMaisProximo;
}

// Função para calcular a menor rota entre as casas selecionadas
function calcularMenorRota(coordenadas, casasSelecionadas) {
    const casasFiltradas = coordenadas.filter(cliente => casasSelecionadas.includes(Number(cliente.casa)));

    const ordemDeVisita = casasFiltradas
        .sort((a, b) => casasSelecionadas.indexOf(Number(a.casa)) - casasSelecionadas.indexOf(Number(b.casa)))
        .map(cliente => cliente.id);

    return ordemDeVisita;
}
// Função para calcular a distância entre dois pontos
function calcularDistancia(pontoA, pontoB) {
    return Math.sqrt(Math.pow(pontoB.x - pontoA.x, 2) + Math.pow(pontoB.y - pontoA.y, 2));
}

// Rota para calcular a rota com base nas casas selecionadas
app.post('/calcula-rota', async (req, res) => {
    try {
        const casasSelecionadas = req.body.casas || [];

        console.log('Casas Selecionadas:', casasSelecionadas);

        // Consulta os clientes das casas selecionadas
        const clientes = await pool.query('SELECT * FROM clientes WHERE casa::integer = ANY($1::int[])', [casasSelecionadas]);

        console.log('Clientes Filtrados:', clientes.rows);

        const coordenadasClientes = clientes.rows.map(cliente => ({ id: cliente.id, x: Number(cliente.x), y: Number(cliente.y), casa: cliente.casa }));

        console.log('Coordenadas dos Clientes:', coordenadasClientes);

        const ordemDeVisita = calcularMenorRota(coordenadasClientes, casasSelecionadas);

        console.log('Ordem de Visita:', ordemDeVisita);

        res.json(ordemDeVisita);
    } catch (error) {
        console.error('Erro ao calcular rota:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
