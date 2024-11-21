import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { handleWebSocketConnection } from './websocket';
import { authenticateToken } from './middleware/auth';
import { loginHandler, registerHandler } from './controllers/auth';
import { getUsersHandler } from './controllers/users';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', registerHandler);
app.post('/api/auth/login', loginHandler);

// Protected routes
app.use('/api', authenticateToken);
app.get('/api/users', getUsersHandler);

// WebSocket connection handling
wss.on('connection', handleWebSocketConnection);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});