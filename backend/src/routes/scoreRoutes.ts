import { Router } from 'express';
import {
  getGameByEventId,
  getNFLGamesOfWeekData,
  updateNFLGamesOfWeekData,
} from '../controllers/scoreController';

const scoreRoutes = Router();

scoreRoutes.get('/', getNFLGamesOfWeekData);
scoreRoutes.get('/:eventId', getGameByEventId);
scoreRoutes.put('/update', updateNFLGamesOfWeekData);

export default scoreRoutes;
