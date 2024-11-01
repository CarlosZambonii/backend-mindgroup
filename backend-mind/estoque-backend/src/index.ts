import express from 'express';
import dotenv from 'dotenv';
import mercadoriasRoutes from './routes/mercadorias.routes';
import pool from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/mercadorias', mercadoriasRoutes);


const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão ao banco de dados realizada com sucesso!');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};
testConnection();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
