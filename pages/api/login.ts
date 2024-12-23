import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@vercel/postgres';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const client = await db.connect();
    try {
      const checkUserQuery = 'SELECT * FROM attendence_user WHERE username = $1';
      const userResult = await client.query(checkUserQuery, [username]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const user = userResult.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const token = jwt.sign({ username: user.username, id: user.id }, 'secret_key', { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
