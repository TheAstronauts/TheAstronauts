import express from 'express';
import cors from 'cors';
import { router as proposalRouter } from './routes/proposals';
import { errorHandler } from './middleware/error';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/proposals', proposalRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 