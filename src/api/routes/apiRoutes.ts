import { Router } from 'express';
import { 
  listData, 
  createCharacter, 
  getCharacter, 
  updateCharacter 
} from '../controllers/characterController';

const router = Router();

// Маршрут для отримання довідників (Класи, Передісторії, Види - за правилами 2024 року)
router.get('/data', listData);

// Маршрути для управління персонажами (CRUD)
router.post('/characters', createCharacter);
router.get('/characters/:id', getCharacter);
router.put('/characters/:id', updateCharacter);

export default router;
