// pages/api/attendance.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const attendanceFilePath = path.join(process.cwd(), 'data', 'attendance.json');

// Read attendance data from JSON file
const readAttendance = () => {
  if (fs.existsSync(attendanceFilePath)) {
    const data = fs.readFileSync(attendanceFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Write attendance data to JSON file
const writeAttendance = (attendance: { username: string; timestamp: string }[]) => {
  fs.writeFileSync(attendanceFilePath, JSON.stringify(attendance, null, 2), 'utf-8');
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, 'secret_key') as { username: string };

      // Read existing attendance data
      const attendance = readAttendance();

      // Mark attendance
      const timestamp = new Date().toISOString();
      attendance.push({ username: decoded.username, timestamp });

      // Write updated attendance data back to file
      writeAttendance(attendance);

      return res.status(200).json({ message: `Attendance marked for ${decoded.username}` });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
