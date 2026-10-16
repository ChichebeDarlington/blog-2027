import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => console.info(`API running at http://localhost:${env.PORT}/api/v1`));
};

void startServer();
