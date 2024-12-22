// pages/attendance.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Attendance = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleMarkAttendance = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/attendance', { token });
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Failed to mark attendance');
    }
  };

  return (
    <div>
      <h1>Mark Attendance</h1>
      <button onClick={handleMarkAttendance}>Mark Attendance</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Attendance;
