// Main Entry Point for DMS Backend Server
// This file bootstraps the NestJS application and configures CORS for frontend communication

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS to allow requests from frontend applications
  app.enableCors({
    origin: [
      'https://dms-flame.vercel.app',  // Production frontend URL
      'http://localhost:3000',         // Development frontend URL
    ],
    credentials: true,  // Allow cookies and authentication headers
  });
  
  // Start the server on the specified port (default 3000)
  await app.listen(process.env.PORT ?? 3000);
}

// Bootstrap the application
bootstrap();
