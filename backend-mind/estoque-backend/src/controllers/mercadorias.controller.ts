import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Função para obter todas as mercadorias
export const getMercadorias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias');
    return res.json(rows); // Retorna os dados das mercadorias
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar mercadorias', error }); // Retorna erro se ocorrer
  }
};

// Função para obter mercadoria por ID
export const getMercadoriaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Pega o ID da mercadoria do parâmetro da requisição
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias WHERE id_mercadoria = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    return res.json(rows[0]); // Retorna a mercadoria encontrada
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar mercadoria', error });
  }
};

// Função para criar uma nova mercadoria
export const createMercadoria = async (req: Request, res: Response): Promise<Response> => {
  console.log("Dados recebidos:", req.body); // Log dos dados recebidos
  try {
      const { codigo, descricao, preco_unitario } = req.body; // Certifique-se de usar o nome correto 'preco_unitario'
      const [result] = await pool.query<ResultSetHeader>(
          'INSERT INTO mercadorias (codigo, descricao, preco_unitario) VALUES (?, ?, ?)',
          [codigo, descricao, preco_unitario] // Use 'preco_unitario' aqui
      );
      return res.status(201).json({ message: 'Mercadoria criada com sucesso', id: result.insertId });
  } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar mercadoria', error });
  }
};

// Função para atualizar uma mercadoria
export const updateMercadoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Pega o ID da mercadoria do parâmetro da requisição
    const { codigo, descricao, preco_unitario } = req.body; // Pega os novos dados da mercadoria do corpo da requisição
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE mercadorias SET codigo = ?, descricao = ?, preco_unitario = ? WHERE id_mercadoria = ?',
      [codigo, descricao, preco_unitario, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    return res.json({ message: 'Mercadoria atualizada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar mercadoria', error });
  }
};

// Função para deletar uma mercadoria
export const deleteMercadoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Pega o ID da mercadoria do parâmetro da requisição
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM mercadorias WHERE id_mercadoria = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Mercadoria não encontrada' });
    return res.json({ message: 'Mercadoria excluída com sucesso' });
  } catch (error) {
    console.error("Erro ao excluir mercadoria:", error); // Log do erro
    return res.status(500).json({ message: 'Erro ao excluir mercadoria', error });
  }
};

export default {
  getMercadorias,
  getMercadoriaById,
  createMercadoria,
  updateMercadoria,
  deleteMercadoria,
};
