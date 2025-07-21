import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ✅ Register the required chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DirectorChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/categories')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        setData({
          labels,
          datasets: [
            {
              label: 'Users per Category',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h2>Director Dashboard</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!data && !error && <p>Loading chart...</p>}
      {data && (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'User Distribution by Category',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Category',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'User Count',
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default DirectorChart;
