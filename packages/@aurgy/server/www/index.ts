import cors from 'cors';
import express from 'express';
import {logger} from '../utils';

// ROUTES
import { lobby_router } from './lobby';
import { me_router } from './me';

const PORT = process.env.PORT ?? 3000;

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'PROD'
  ? 'https://aurgy.creativelabsucla.com'
  : 'http://localhost:3000';

app.use(cors({ origin: allowedOrigins }));

app.use(express.json()); // for parsing application/json

app.get('/', async (_req, res) => {
  res.send('Welcome to the aurgy, backend.');
});

// LOGIN
app.use('/lobby', lobby_router);
app.use('/me', me_router);

app.listen(PORT, () => logger.info(`App listening on PORT ${PORT}`));
