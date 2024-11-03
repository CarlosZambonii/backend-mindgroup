import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mercadoriasRoutes from './routes/mercadorias.routes';
import authRoutes from './routes/auth'; // Importa as rotas de autenticação
import pool from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para analisar o corpo da requisição como JSON

// Rotas
app.use('/api/auth', authRoutes); // Registra as rotas de autenticação
app.use('/api/mercadorias', mercadoriasRoutes); // Registra as rotas de mercadorias

// Teste de conexão com o banco de dados
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão ao banco de dados realizada com sucesso!');
        connection.release();
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

// Conectar ao banco de dados
testConnection();

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
