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

// InsightsChart component definition
const InsightsChart = () => {
  const [chartData, setChartData] = useState({});

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await axios.get('http://localhost:5000/insights');
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

          // Extract sectors and intensities for chart
          const sectors = Object.keys(sectorIntensityMap);
          const intensities = Object.values(sectorIntensityMap);

          // Update chart data state
          setChartData({
            labels: sectors,
            datasets: [
              {
                label: 'Intensity',
                data: intensities,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              }
            ]
          });
        } else {
          console.error('Fetched insights data is not an array:', insights);
        }
      } catch (error) {
        console.error('Error fetching insights data:', error.message);
      }
    };

    // Call fetchData function on component mount
    fetchData();
  }, []);

  // Render the InsightsChart component
  return (
    <Container className="chart-container">
      <Paper elevation={3} className="chart-paper">
        <Typography variant="h5" component="h2">
          Sector Intensity
        </Typography>
        {chartData.labels ? (
          // Render Bar chart if chartData.labels is available
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        ) : (
          // Render CircularProgress if chartData.labels is not available
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default InsightsChart;
