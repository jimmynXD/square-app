import express from 'express';
import cors from 'cors';
import errorHandler from './utils/errorHandler';
import teamRoutes from './routes/teamRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import scoreRoutes from './routes/scoreRoutes';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/team', teamRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/score', scoreRoutes);
app.use(errorHandler);

export default app;
