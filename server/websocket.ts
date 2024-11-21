import { WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

const clients = new Map<string, AuthenticatedWebSocket>();

const messageSchema = z.object({
  type: z.enum(['message', 'typing', 'read']),
  content: z.string().optional(),
  recipientId: z.string(),
  timestamp: z.number(),
});

export const handleWebSocketConnection = async (ws: AuthenticatedWebSocket, req: any) => {
  try {
    // Extract token from query string
    const token = req.url.split('?token=')[1];
    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    ws.userId = decoded.userId;
    ws.isAlive = true;

    // Store client connection
    clients.set(decoded.userId, ws);

    // Set up ping-pong for connection health check
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Handle incoming messages
    ws.on('message', async (data: string) => {
      try {
        const message = messageSchema.parse(JSON.parse(data));
        
        // Handle different message types
        switch (message.type) {
          case 'message':
            handleChatMessage(ws, message);
            break;
          case 'typing':
            handleTypingStatus(ws, message);
            break;
          case 'read':
            handleReadReceipt(ws, message);
            break;
        }
      } catch (error) {
        sendError(ws, 'Invalid message format');
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        broadcastUserStatus(ws.userId, 'offline');
      }
    });

    // Send initial connection success
    ws.send(JSON.stringify({
      type: 'connection',
      status: 'success',
      userId: ws.userId
    }));

    // Broadcast user online status
    broadcastUserStatus(ws.userId, 'online');

  } catch (error) {
    ws.close(4002, 'Invalid token');
  }
};

// Handle chat messages
const handleChatMessage = (ws: AuthenticatedWebSocket, message: z.infer<typeof messageSchema>) => {
  const recipientWs = clients.get(message.recipientId);
  if (recipientWs) {
    recipientWs.send(JSON.stringify({
      type: 'message',
      senderId: ws.userId,
      content: message.content,
      timestamp: message.timestamp
    }));
  }
};

// Handle typing status
const handleTypingStatus = (ws: AuthenticatedWebSocket, message: z.infer<typeof messageSchema>) => {
  const recipientWs = clients.get(message.recipientId);
  if (recipientWs) {
    recipientWs.send(JSON.stringify({
      type: 'typing',
      senderId: ws.userId,
      timestamp: message.timestamp
    }));
  }
};

// Handle read receipts
const handleReadReceipt = (ws: AuthenticatedWebSocket, message: z.infer<typeof messageSchema>) => {
  const recipientWs = clients.get(message.recipientId);
  if (recipientWs) {
    recipientWs.send(JSON.stringify({
      type: 'read',
      senderId: ws.userId,
      timestamp: message.timestamp
    }));
  }
};

// Broadcast user status to all connected clients
const broadcastUserStatus = (userId: string, status: 'online' | 'offline') => {
  clients.forEach((client) => {
    if (client.userId !== userId) {
      client.send(JSON.stringify({
        type: 'status',
        userId,
        status
      }));
    }
  });
};

// Send error message to client
const sendError = (ws: WebSocket, message: string) => {
  ws.send(JSON.stringify({
    type: 'error',
    message
  }));
};

// Connection health check interval
setInterval(() => {
  clients.forEach((ws) => {
    if (!ws.isAlive) {
      if (ws.userId) {
        clients.delete(ws.userId);
        broadcastUserStatus(ws.userId, 'offline');
      }
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);