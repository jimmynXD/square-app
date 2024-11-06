import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT || '8080', 10);

app
  .listen(8080, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  })
  .on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
