import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './InsightsChart.css';

// Register necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InsightsChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/insights'); // Fetch data from backend
        const insights = response.data;

        if (Array.isArray(insights)) {
          // Aggregate data by sector
          const sectorIntensityMap = insights.reduce((acc, insight) => {
            if (!acc[insight.sector]) {
              acc[insight.sector] = 0;
            }
            acc[insight.sector] += insight.intensity;
            return acc;
          }, {});

          const sectors = Object.keys(sectorIntensityMap);
          const intensities = Object.values(sectorIntensityMap);

          setChartData({
            labels: sectors,
            datasets: [
              {
                label: 'Intensity',
                data: intensities,
                backgroundColor: sectors.map(
                  () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
                ),
              }
            ]
          });
          setLoading(false);
        } else {
          console.error('Fetched insights data is not an array:', insights);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching insights data:', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <Paper elevation={3} className="chart-paper">
        <Typography variant="h5" component="h2">
          Sector Intensity
        </Typography>
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          chartData.labels ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Sectors'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Intensity'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Intensity: ${context.raw}`;
                      }
                    }
                  }
                }
              }}
            />
          ) : (
            <Typography variant="h6" component="p">
              No data available.
            </Typography>
          )
        )}
      </Paper>
    </div>
  );
};

export default InsightsChart;
