import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getEstoques = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM estoques');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estoques', error });
  }
};

export const getEstoqueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM estoques WHERE id_estoque = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Estoque não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estoque', error });
  }
};

export const createEstoque = async (req: Request, res: Response) => {
  try {
    const { id_mercadoria, quantidade } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO estoques (id_mercadoria, quantidade) VALUES (?, ?)',
      [id_mercadoria, quantidade]
    );
    res.status(201).json({ message: 'Estoque criado com sucesso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar estoque', error });
  }
};

export const updateEstoque = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id_mercadoria, quantidade } = req.body;
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE estoques SET id_mercadoria = ?, quantidade = ? WHERE id_estoque = ?',
      [id_mercadoria, quantidade, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Estoque não encontrado' });
    res.json({ message: 'Estoque atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar estoque', error });
  }
};


export const deleteEstoque = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM estoques WHERE id_estoque = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Estoque não encontrado' });
    res.json({ message: 'Estoque excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir estoque', error });
  }
};
