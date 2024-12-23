// pages/api/attendance/report.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import { db } from '@vercel/postgres';

const client = await db.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Decode the token to get the username (assumes the JWT contains a 'username' field)
      const decoded = jwt.verify(token, 'secret_key') as { username: string };
      const username = decoded.username;

      // Query for all attendance records for the user
      const query = 'SELECT status, date FROM attendance WHERE username = $1 ORDER BY date DESC';
      const result = await client.query(query, [username]);

      // Check if we got any results
      if (result.rows.length > 0) {
        return res.status(200).json({ attendance: result.rows });
      } else {
        return res.status(404).json({ message: 'No attendance records found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}