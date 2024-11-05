import express from 'express';
import multer from 'multer';
import {
  getMercadorias,
  getMercadoriaById,
  createMercadoria,
  updateMercadoria,
  deleteMercadoria,
} from '../controllers/mercadorias.controller';

// Definindo um tipo para a requisição
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Certifique-se de usar 'Multer.File'
    }
  }
}

const router = express.Router();

// Configuração do multer
const upload = multer(); // Você pode configurar mais opções se necessário

// Rota para obter todas as mercadorias
router.get('/', (req: express.Request, res: express.Response) => {
  getMercadorias(req, res);
});

// Rota para obter mercadoria por ID
router.get('/:id', (req: express.Request, res: express.Response) => {
  getMercadoriaById(req, res);
});

// Rota para criar uma nova mercadoria com upload de imagem
router.post('/', upload.single('imagem'), (req: express.Request, res: express.Response) => {
  createMercadoria(req, res);
});

// Rota para atualizar uma mercadoria
router.put('/:id', (req: express.Request, res: express.Response) => {
  updateMercadoria(req, res);
});

// Rota para deletar uma mercadoria
router.delete('/:id', (req: express.Request, res: express.Response) => {
  deleteMercadoria(req, res);
});

export default router;
