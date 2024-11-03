// auth.ts
import { Router, Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Importe o JWT

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt'; // Melhor usar uma variável de ambiente

// Rota para criar um novo usuário
router.post('/cadastro', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Preencha todos os campos.' });
        return;
    }

    try {
        // Criptografa a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        const insertId = (result as any).insertId;

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário.' });
    }
});

// Rota de Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Preencha todos os campos.' });
        return;
    }

    try {
        // Busca o usuário pelo email
        const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        // Compara a senha fornecida com a senha armazenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Senha incorreta.' });
            return;
        }

        // Gera um token JWT para o usuário autenticado
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Define o tempo de expiração do token
        });

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token, // Envia o token na resposta
            userId: user.id,
            success: true,
        });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

// Middleware para verificar o token JWT
export const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET);
        req.body.user = decoded; // Armazena os dados do token no request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default router;
