// pages/dashboard.tsx
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [logs, setLogs] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('/api/getLogs');
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        console.error('Failed to fetch logs');
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Log Dashboard</h1>
      <pre>{logs}</pre>
    </div>
  );
};

export default Dashboard;
