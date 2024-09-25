import { Router } from 'express';
import {
  getSchedulesData,
  getTeamScheduleByAbbreviation,
  updateSchedulesData,
} from '../controllers/scheduleController';

const scheduleRoutes = Router();

scheduleRoutes.get('/', getSchedulesData);
scheduleRoutes.get('/:abbreviation', getTeamScheduleByAbbreviation);
scheduleRoutes.put('/update', updateSchedulesData);

export default scheduleRoutes;
