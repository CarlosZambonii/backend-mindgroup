import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getMercadorias = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mercadorias', error });
  }
};

export const getMercadoriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias WHERE id_mercadoria = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mercadoria', error });
  }
};

export const createMercadoria = async (req: Request, res: Response) => {
  try {
    const { codigo, descricao, preco_unitario } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO mercadorias (codigo, descricao, preco_unitario) VALUES (?, ?, ?)',
      [codigo, descricao, preco_unitario]
    );
    res.status(201).json({ message: 'Mercadoria criada com sucesso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar mercadoria', error });
  }
};

export const updateMercadoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { codigo, descricao, preco_unitario } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE mercadorias SET codigo = ?, descricao = ?, preco_unitario = ? WHERE id_mercadoria = ?',
      [codigo, descricao, preco_unitario, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    res.json({ message: 'Mercadoria atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar mercadoria', error });
  }
};

export const deleteMercadoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM mercadorias WHERE id_mercadoria = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    res.json({ message: 'Mercadoria excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir mercadoria', error });
  }
};
const mercadoriasController = {
    getMercadorias,
    getMercadoriaById,
    createMercadoria,
    updateMercadoria,
    deleteMercadoria,
};

export default mercadoriasController;