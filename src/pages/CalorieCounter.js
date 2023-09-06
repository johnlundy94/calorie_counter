import React, { useEffect, useRef, useState, useContext } from 'react';
import Chart from 'chart.js/auto';
import { UserContext } from '../context/userContext';
import firebaseConfig from '../config/firebase';

import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore methods

const { db } = firebaseConfig; 

const CalorieCounter = () => {
  const chartRef = useRef(null);
  const { userState, userDispatch } = useContext(UserContext);
  const { tdee, uid, todayCalories } = userState;

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchData = async () => {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          userDispatch({ type: "SET_TODAY_CALORIES", payload: userData.todayCalories || 0 });
          userDispatch({ type: "SET_CALORIE_UPDATES", payload: userData.calorieUpdates || [] });
        }
      }
    };

    fetchData();
  }, [uid]);

    // Reset daily calories at midnight
    useEffect(() => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
      const timer = setTimeout(() => {
        userDispatch({ type: "SET_TODAY_CALORIES", payload: 0 });
      }, midnight);
  
      return () => clearTimeout(timer);
    }, [userDispatch]);

    useEffect(() => {
      if (chartRef && chartRef.current && userState.calorieUpdates) {
        const calorieUpdatesLength = userState.calorieUpdates.length;
    
        const tdeeData = Array(calorieUpdatesLength).fill(tdee); 

        const chartInstance = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels: userState.calorieUpdates ?userState.calorieUpdates.map(update => update.time) : [],
            datasets: [
              {
                label: 'TDEE',
                data: tdeeData,
                borderColor: 'rgba(255, 0, 0, 1)',
              },
              {
                label: 'Today Calories',
                data: userState.calorieUpdates ?userState.calorieUpdates.map(update => update.cumulativeCalories) : [],
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
    }, [todayCalories, tdee, userState.calorieUpdates]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newCalories = parseInt(e.target.userCalories.value, 10);

    if (isNaN(newCalories)) {
      alert('Please enter a valid number');
      return;
    }

    const updatedCalories = userState.todayCalories + newCalories;

    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    const newCalorieUpdates = [...userState.calorieUpdates, { time: currentTime, cumulativeCalories: updatedCalories}]

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { todayCalories: updatedCalories, calorieUpdates: newCalorieUpdates }, { merge: true });

    userDispatch({ type: "SET_TODAY_CALORIES", payload: updatedCalories });
    userDispatch({ type: "SET_CALORIE_UPDATES", payload: newCalorieUpdates });
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
