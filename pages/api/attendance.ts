// pages/api/attendance.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { db } from '@vercel/postgres';

const client = await db.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, status } = req.body;
    if (status !== 'present' && status !== 'absent') {
      return res.status(400).json({ message: 'Invalid status, must be "present" or "absent"' });
    }
    try {
      const tableQuery = `
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent')),
        date VARCHAR(255) NOT NULL
      )`;      
      const createTable = await client.query(tableQuery);
     
      const decoded = jwt.verify(token, 'secret_key') as { username: string };
      const date = new Date().toISOString().split('T')[0];
      const query = 'INSERT INTO attendance(username, status, date) VALUES($1, $2, $3)';
      const values = [decoded.username, status, date];
      await client.query(query, values);
      return res.status(200).json({ message: `Attendance marked as ${status} for ${decoded.username} on ${date}` });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}