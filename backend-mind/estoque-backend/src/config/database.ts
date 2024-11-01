import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


const testConnection = async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Conexão ao banco de dados realizada com sucesso!');
      connection.release(); // Libere a conexão de volta ao pool
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  };
  
  // Chama a função de teste de conexão
  testConnection();
  
  export default pool;