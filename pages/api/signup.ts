import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
const client = await db.connect();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
      const tableQuery = 'CREATE TABLE IF NOT EXISTS attendence_user (username VARCHAR(255) NOT NULL,password TEXT NOT NULL)';
      const createTable = await client.query(tableQuery);
      const checkUserQuery = 'SELECT * FROM attendence_user WHERE username = $1';
      const userResult = await client.query(checkUserQuery, [username]);
      if (userResult.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO attendence_user (username, password) VALUES ($1, $2) RETURNING *';
      const result = await client.query(insertUserQuery, [username, hashedPassword]);
      return res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
