import { Request, Response } from 'express';
import { users } from './auth';

export const getUsersHandler = (req: Request, res: Response) => {
  const currentUserId = (req.user as any).userId;
  
  // Convert users Map to array and exclude current user
  const userList = Array.from(users.values())
    .filter(user => user.id !== currentUserId)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));

  res.json(userList);
};