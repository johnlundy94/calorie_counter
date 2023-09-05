import React, { useEffect, useRef, useState, useContext } from 'react';
import Chart from 'chart.js/auto';
import { UserContext } from '../context/userContext';
import firebaseConfig from '../config/firebase';

import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore methods

const { db } = firebaseConfig; 

const CalorieCounter = () => {
  const chartRef = useRef(null);
  const { userState, userDispatch } = useContext(UserContext);
  const { tdee, uid } = userState;
  const [userCalories, setUserCalories] = useState([]);

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchData = async () => {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserCalories(userData.dailyCalories || []);
        }
      }
    };

    fetchData();
  }, [uid]);

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
        chartInstance.destroy();
      };
    }
  }, [userCalories, tdee]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newCalories = parseInt(e.target.userCalories.value);
    const updatedCalories = [...userCalories, newCalories];

    // Update Firestore
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { dailyCalories: updatedCalories }, { merge: true });

    setUserCalories(updatedCalories);
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
