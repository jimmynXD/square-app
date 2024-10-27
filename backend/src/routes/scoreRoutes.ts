import { Router } from 'express';
import {
  updateNFLGameScoresData,
  getGameByEventId,
  getNFLGameScoresData,
  updateWinnerData,
  updateAllWinnersData,
  updateLiveScoresAndWinnersData,
} from '../controllers/scoreController';

const scoreRoutes = Router();

scoreRoutes.get('/', getNFLGameScoresData);
scoreRoutes.get('/:eventId', getGameByEventId);
scoreRoutes.put('/update', updateNFLGameScoresData);
scoreRoutes.put('/update/winner', updateAllWinnersData);
scoreRoutes.put('/update/winner/:gridId', updateWinnerData);
scoreRoutes.put('/update-live', updateLiveScoresAndWinnersData);

export default scoreRoutes;
