import { Router } from 'express';
import {
  getTeamByAbbreviation,
  getTeamsData,
  updateTeamsData,
} from '../controllers/teamController';

const teamRoutes = Router();

teamRoutes.get('/', getTeamsData);
teamRoutes.get('/:abbreviation', getTeamByAbbreviation);
teamRoutes.put('/update', updateTeamsData);

export default teamRoutes;
