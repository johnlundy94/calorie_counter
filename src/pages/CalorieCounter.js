import "../styling/CalorieCounter.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import Chart from "chart.js/auto";
import { UserContext } from "../context/userContext";
import firebaseConfig from "../config/firebase";
import Nav from "../components/Nav";

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
          userDispatch({
            type: "SET_TODAY_CALORIES",
            payload: userData.todayCalories || 0,
          });
          userDispatch({
            type: "SET_CALORIE_UPDATES",
            payload: userData.calorieUpdates || [],
          });
        }
      }
    };

    fetchData();
  }, [uid]);

  // Reset daily calories at midnight
  useEffect(() => {
    // Function to reset the calories to 0
    const resetCalories = () => {
      userDispatch({ type: "SET_TODAY_CALORIES", payload: 0 });
      // Also update this data in your Firestore database if needed
    };

    // Function to calculate time until the next midnight
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      return midnight - now;
    };

    // Initial setTimeout to wait until the next midnight
    const timer = setTimeout(() => {
      resetCalories(); // Reset the calories at the next midnight
      // Set an interval to reset the calories every 24 hours after that
      setInterval(resetCalories, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }, calculateTimeUntilMidnight());

    // Cleanup function
    return () => {
      clearTimeout(timer); // Clear the initial setTimeout
      // You might also want to clear the setInterval if the component unmounts,
      // but that's a bit more involved as you'd need to keep its ID.
    };
  }, [userDispatch]);

  const formatTime = (timeInput) => {
    if (typeof timeInput === "string") {
      return timeInput;
    } else {
      const date = new Date(timeInput);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const period = hours < 12 ? "AM" : "PM";
      return `${formattedHours}:${formattedMinutes} ${period}`;
    }
  };

  useEffect(() => {
    if (chartRef && chartRef.current && userState.calorieUpdates) {
      const calorieUpdatesLength = userState.calorieUpdates.length;

      const tdeeData = Array(calorieUpdatesLength).fill(tdee);

      console.log("Calorie Updates: ", userState.calorieUpdates); // <-- Log the updates here
      userState.calorieUpdates.forEach((update) => {
        console.log("Update Time: ", update.time); // <-- Log the time here
      });

      const chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: userState.calorieUpdates
            ? userState.calorieUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "TDEE",
              data: tdeeData,
              borderColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Today's Calories",
              data: userState.calorieUpdates
                ? userState.calorieUpdates.map(
                    (update) => update.cumulativeCalories
                  )
                : [],
              borderColor: "rgba(0, 0, 255, 1)",
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
      alert("Please enter a valid number");
      return;
    }

    const updatedCalories = userState.todayCalories + newCalories;

    const now = new Date();
    const currentTime = formatTime(now);

    const newCalorieUpdates = [
      ...userState.calorieUpdates,
      { time: currentTime, cumulativeCalories: updatedCalories },
    ];

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      { todayCalories: updatedCalories, calorieUpdates: newCalorieUpdates },
      { merge: true }
    );

    userDispatch({ type: "SET_TODAY_CALORIES", payload: updatedCalories });
    userDispatch({ type: "SET_CALORIE_UPDATES", payload: newCalorieUpdates });
  };

  return (
    <div className="calorie-counter">
      <Nav />
      <h2 className="calorie-title">Your Daily Calorie Intake</h2>
      <p className="calorie-description">
        Based on your information, you should consume approximately{" "}
        {Math.round(tdee)} calories per day.
      </p>
      <div className="calorie-chart">
        <canvas ref={chartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleFormSubmit}>
        <input
          className="calorie-input"
          name="userCalories"
          type="number"
          placeholder="Enter calories"
        />
        <button className="calorie-button" type="submit">
          Update Calories
        </button>
      </form>
    </div>
  );
};

export default CalorieCounter;
