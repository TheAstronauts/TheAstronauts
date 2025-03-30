import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deploy() {
  try {
    // Build frontend
    console.log('Building frontend...');
    await execAsync('cd frontend && npm run build');

    // Build backend
    console.log('Building backend...');
    await execAsync('cd backend && npm run build');

    // Run database migrations
    console.log('Running database migrations...');
    await execAsync('cd backend && npx prisma migrate deploy');

    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy(); 