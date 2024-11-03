import express from 'express';

import {
  getMercadorias,
  getMercadoriaById,
  createMercadoria,
  updateMercadoria,
  deleteMercadoria,
} from '../controllers/mercadorias.controller';

const router = express.Router();

// Rota para obter todas as mercadorias
router.get('/mercadorias', (req: express.Request, res: express.Response) => {
  getMercadorias(req, res);
});

// Rota para obter mercadoria por ID

router.get('/mercadorias/:id', (req: express.Request, res: express.Response) => {
  getMercadoriaById(req, res);
});

// Rota para criar uma nova mercadoria

router.post('/mercadorias', (req: express.Request, res: express.Response) => {
  createMercadoria(req, res);
});

// Rota para atualizar uma mercadoria
router.put('/mercadorias/:id', (req: express.Request, res: express.Response) => {
  updateMercadoria(req, res);
});

// Rota para deletar uma mercadoria
router.delete('/mercadorias/:id', (req: express.Request, res: express.Response) => {
  deleteMercadoria(req, res);
});

export default router;
