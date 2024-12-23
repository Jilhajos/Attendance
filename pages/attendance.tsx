import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/global.css';
const Attendance = () => {
  const [status, setStatus] = useState<'present' | 'absent'>('present');
  const [message, setMessage] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState<{ status: string, date: string }[]>([]);
  const [hasMarkedToday, setHasMarkedToday] = useState<boolean>(false); // State to track if attendance is marked today
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchAttendanceHistory(token);
    }
  }, [router]);
  const fetchAttendanceHistory = async (token: string) => {
    try {
      const response = await axios.get('/api/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const history = response.data.attendance;
      setAttendanceHistory(history);
      const today = new Date().toISOString().split('T')[0];
      const attendanceToday = history.filter((record: { status : string , date: string; }) => record.date == today).length;
      if (attendanceToday) {
        setHasMarkedToday(true);
      }
    } catch (err) {
      setMessage('Failed to fetch attendance history');
    }
  };
  const handleMarkAttendance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to mark attendance');
      return;
    }
    if (hasMarkedToday) {
      alert('You have already marked your attendance for today');
      return;
    }
    try {
      const response = await axios.post('/api/attendance', { token, status });
      setMessage(response.data.message);
      console.log("hi")
      fetchAttendanceHistory(token);
    } catch (err) {
      setMessage('Failed to mark attendance');
    }
  };
  return (
    <div className="container">
      <h1 className="title">Mark Your Attendance</h1>
      <div className="status-selector">
        <label>
          <input
            type="radio"
            name="status"
            value="present"
            checked={status === 'present'}
            onChange={() => setStatus('present')}
          />
          <span>Present</span>
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="absent"
            checked={status === 'absent'}
            onChange={() => setStatus('absent')}
          />
          <span>Absent</span>
        </label>
      </div>
      <button className="submit-button" onClick={handleMarkAttendance}>
        Mark Attendance
      </button>
      {message && <p className="message">{message}</p>}
      <h2 className="report-title">Attendance Report</h2>
      {attendanceHistory.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-records">No attendance records found</p>
      )}
    </div>
  );
};

export default Attendance;