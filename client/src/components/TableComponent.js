import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TableComponent = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/protected');
      setData(response.data);
    } catch (error) {
      setError('Failed to load data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Protected Table Component</h2>
      <p>Welcome, {user.email}!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Your Data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      
      <button onClick={fetchData} style={{ marginTop: '20px' }}>
        Refresh Data
      </button>
    </div>
  );
};

export default TableComponent;
