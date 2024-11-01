import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import express from 'express';
const router = express.Router();

export const getMercadoriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Certifique-se que o tipo de 'id' está correto (por exemplo, number)
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias WHERE id_mercadoria = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Mercadoria não encontrada' });
    }

   
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar mercadoria' });
  }
};

export default router;