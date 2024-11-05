import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Função para obter todas as mercadorias
export const getMercadorias = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mercadorias');
    
    // Converter BLOB para base64 para cada mercadoria
    const mercadorias = rows.map(mercadoria => ({
      ...mercadoria,
      imagens: mercadoria.imagens ? `data:image/jpeg;base64,${mercadoria.imagens.toString('base64')}` : null
    }));

    return res.json(mercadorias); // Retorna os dados das mercadorias com a imagem em base64
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
    
    // Converter BLOB para base64
    const mercadoria = {
      ...rows[0],
      imagens: rows[0].imagens ? `data:image/jpeg;base64,${rows[0].imagens.toString('base64')}` : null
    };

    return res.json(mercadoria); // Retorna a mercadoria encontrada
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar mercadoria', error });
  }
};

// Função para criar uma nova mercadoria
export const createMercadoria = async (req: Request, res: Response): Promise<Response> => {
  console.log("Dados recebidos:", req.body);
  console.log("Arquivo recebido:", req.file);

  try {
    const { codigo, descricao, preco_unitario, quantidade } = req.body;

    // Verifique se os dados necessários estão presentes
    if (!codigo || !descricao || isNaN(Number(preco_unitario)) || isNaN(Number(quantidade))) {
      return res.status(400).json({ message: 'Dados inválidos.' });
    }

    const imagem = req.file ? req.file.buffer : null; // Obter imagem se existir

    // Insira a mercadoria no banco de dados
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO mercadorias (codigo, descricao, preco_unitario, quantidade, imagens) VALUES (?, ?, ?, ?, ?)',
      [codigo, descricao, parseFloat(preco_unitario), parseInt(quantidade, 10), imagem] // Certifique-se de converter os tipos adequadamente
    );

    return res.status(201).json({ message: 'Mercadoria criada com sucesso', id: result.insertId });
  } catch (error) {
    console.error("Erro ao criar mercadoria:", error);
    return res.status(500).json({ message: 'Erro ao criar mercadoria', error });
  }
};

// Função para atualizar uma mercadoria
export const updateMercadoria = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Pega o ID da mercadoria do parâmetro da requisição
    const { codigo, descricao, preco_unitario, quantidade } = req.body; // Pega os novos dados da mercadoria do corpo da requisição

    // Atualiza os dados da mercadoria
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE mercadorias SET codigo = ?, descricao = ?, preco_unitario = ?, quantidade = ? WHERE id_mercadoria = ?',
      [codigo, descricao, preco_unitario, quantidade, id]
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
