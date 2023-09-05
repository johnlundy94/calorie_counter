import React, { useEffect, useRef, useState, useContext } from 'react';
import Chart from 'chart.js/auto';
import { UserContext } from '../context/userContext';

const CalorieCounter = () => {
  const { userState } = useContext(UserContext);
  const { tdee } = userState;
  const [userCalories, setUserCalories] = useState([]); // Array to hold user calorie data
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: userCalories.map((_, index) => index),
          datasets: [
            {
              label: 'TDEE',
              data: Array(userCalories.length).fill(tdee),
              borderColor: 'rgba(255, 0, 0, 1)',
            },
            {
              label: 'User Calories',
              data: userCalories,
              borderColor: 'rgba(0, 0, 255, 1)',
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chartInstance.destroy(); // This will clean up the chart instance when the component is unmounted.
      };
    }
  }, [userCalories, tdee]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newCalories = parseInt(e.target.userCalories.value);
    setUserCalories([...userCalories, newCalories]);
  };

  return (
    <div>
      <h2>Your Daily Calorie Intake</h2>
      <p>Based on your information, you should consume approximately {Math.round(tdee)} calories per day.</p>
      <canvas ref={chartRef} />
      <form onSubmit={handleFormSubmit}>
        <input name="userCalories" type="number" placeholder="Enter calories" />
        <button type="submit">Update Calories</button>
      </form>
    </div>
  );
};

export default CalorieCounter;