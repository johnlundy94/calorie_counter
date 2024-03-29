import "../styling/CalorieCounter.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import Chart from "chart.js/auto";
import { UserContext } from "../context/userContext";
import firebaseConfig from "../config/firebase";
import Nav from "../components/Nav";

import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore methods

const { db } = firebaseConfig;

const CalorieCounter = () => {
  const calorieChartRef = useRef(null);
  const proteinChartRef = useRef(null);
  const carbsChartRef = useRef(null);
  const fatsChartRef = useRef(null);
  const fiberChartRef = useRef(null);
  const { userState, userDispatch } = useContext(UserContext);
  const {
    tdee,
    uid,
    todayCalories,
    protein,
    dailyProtein,
    carbs,
    dailyCarbs,
    fats,
    dailyFats,
    fiber,
    dailyFiber,
  } = userState;

  useEffect(() => {
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
          userDispatch({
            type: "SET_DAILY_PROTEIN",
            payload: userData.dailyProtein || 0,
          });
          userDispatch({
            type: "SET_PROTEIN_UPDATES",
            payload: userData.proteinUpdates || [],
          });
          userDispatch({
            type: "SET_DAILY_CARBS",
            payload: userData.dailyCarbs || 0,
          });
          userDispatch({
            type: "SET_CARBS_UPDATES",
            payload: userData.carbsUpdates || [],
          });
          userDispatch({
            type: "SET_DAILY_FATS",
            payload: userData.dailyFats || 0,
          });
          userDispatch({
            type: "SET_FATS_UPDATES",
            payload: userData.fatsUpdates || [],
          });
          userDispatch({
            type: "SET_DAILY_FIBER",
            payload: userData.dailyFiber || 0,
          });
          userDispatch({
            type: "SET_FIBER_UPDATES",
            payload: userData.fiberUpdates || [],
          });
        }
      }
    };

    fetchData();
  }, [uid]);

  useEffect(() => {
    const resetData = () => {
      userDispatch({ type: "SET_TODAY_CALORIES", payload: 0 });
      userDispatch({ type: "SET_DAILY_PROTEIN", payload: 0 });
      userDispatch({ type: "SET_DAILY_CARBS", payload: 0 });
      userDispatch({ type: "SET_DAILY_FATS", payload: 0 });
      userDispatch({ type: "SET_DAILY_FIBER", payload: 0 });
    };

    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      return midnight - now;
    };

    const timer = setTimeout(() => {
      resetData();
      setInterval(resetData, 24 * 60 * 60 * 1000);
    }, calculateTimeUntilMidnight());

    return () => {
      clearTimeout(timer);
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
    if (
      calorieChartRef &&
      calorieChartRef.current &&
      userState.calorieUpdates &&
      proteinChartRef &&
      proteinChartRef.current &&
      userState.proteinUpdates &&
      carbsChartRef &&
      carbsChartRef.current &&
      userState.carbsUpdates &&
      fatsChartRef &&
      fatsChartRef.current &&
      userState.fatsUpdates &&
      fiberChartRef &&
      fiberChartRef.current &&
      userState.fiberUpdates
    ) {
      const calorieUpdatesLength = userState.calorieUpdates.length;
      const proteinUpdatesLength = userState.proteinUpdates.length;
      const carbsUpdatesLength = userState.carbsUpdates.length;
      const fatsUpdatesLength = userState.fatsUpdates.length;
      const fiberUpdatesLength = userState.fiberUpdates.length;

      const tdeeData = Array(calorieUpdatesLength).fill(tdee);
      const proteinData = Array(proteinUpdatesLength).fill(protein);
      const carbsData = Array(carbsUpdatesLength).fill(carbs);
      const fatsData = Array(fatsUpdatesLength).fill(fats);
      const fiberData = Array(fiberUpdatesLength).fill(fiber);

      console.log("Calorie Updates: ", userState.calorieUpdates);
      console.log("Protein Updates: ", userState.proteinUpdates);
      console.log("Carbs Updates: ", userState.carbsUpdates);
      console.log("Fats Updates:", userState.fatsUpdattes);
      console.log("Fiber Updates:", userState.fiberUpdattes);
      userState.calorieUpdates.forEach((update) => {
        console.log("Update Time: ", update.time); // <-- Log the time here
      });

      const calorieChartInstance = new Chart(calorieChartRef.current, {
        type: "line",
        data: {
          labels: userState.calorieUpdates
            ? userState.calorieUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "Calories",
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

      const proteinChartInstance = new Chart(proteinChartRef.current, {
        type: "line",
        data: {
          labels: userState.proteinUpdates
            ? userState.proteinUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "Protein",
              data: proteinData,
              borderColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Today's Protein",
              data: userState.proteinUpdates
                ? userState.proteinUpdates.map(
                    (update) => update.cumulativeProtein
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

      const carbsChartInstance = new Chart(carbsChartRef.current, {
        type: "line",
        data: {
          labels: userState.carbsUpdates
            ? userState.carbsUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "Carbohydrates",
              data: carbsData,
              borderColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Today's Carbohydates",
              data: userState.carbsUpdates
                ? userState.carbsUpdates.map((update) => update.cumulativeCarbs)
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

      const fatsChartInstance = new Chart(fatsChartRef.current, {
        type: "line",
        data: {
          labels: userState.fatsUpdates
            ? userState.fatsUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "Fats",
              data: fatsData,
              borderColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Today's Fats",
              data: userState.fatsUpdates
                ? userState.fatsUpdates.map((update) => update.cumulativeFats)
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

      const fiberChartInstance = new Chart(fiberChartRef.current, {
        type: "line",
        data: {
          labels: userState.fiberUpdates
            ? userState.fiberUpdates.map((update) => formatTime(update.time))
            : [],
          datasets: [
            {
              label: "Fiber",
              data: fiberData,
              borderColor: "rgba(255, 0, 0, 1)",
            },
            {
              label: "Today's Fiber",
              data: userState.fiberUpdates
                ? userState.fiberUpdates.map((update) => update.cumulativeFiber)
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
        calorieChartInstance.destroy();
        proteinChartInstance.destroy();
        carbsChartInstance.destroy();
        fatsChartInstance.destroy();
        fiberChartInstance.destroy();
      };
    }
  }, [
    todayCalories,
    tdee,
    userState.calorieUpdates,
    dailyProtein,
    protein,
    userState.proteinUpdates,
    dailyCarbs,
    carbs,
    userState.carbsUpdates,
    dailyFats,
    fats,
    userState.fatsUpdates,
    dailyFiber,
    fiber,
    userState.fiberUpdates,
  ]);

  const handleCalorieSubmit = async (e) => {
    e.preventDefault();
    const newCalories = parseInt(e.target.userCalories.value, 10);

    console.log("newCalories and newProtein values", newCalories);
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
      {
        todayCalories: updatedCalories,
        calorieUpdates: newCalorieUpdates,
      },
      { merge: true }
    );

    userDispatch({ type: "SET_TODAY_CALORIES", payload: updatedCalories });
    userDispatch({ type: "SET_CALORIE_UPDATES", payload: newCalorieUpdates });
  };

  const handleProteinSubmit = async (e) => {
    e.preventDefault();
    const newProtein = parseInt(e.target.userProtein.value, 10);

    console.log("newProtein values", newProtein);
    if (isNaN(newProtein)) {
      alert("Please enter a valid number");
      return;
    }

    const updatedProtein = userState.dailyProtein + newProtein;

    const now = new Date();
    const currentTime = formatTime(now);

    const newProteinUpdates = [
      ...userState.proteinUpdates,
      { time: currentTime, cumulativeProtein: updatedProtein },
    ];

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      {
        dailyProtein: updatedProtein,
        proteinUpdates: newProteinUpdates,
      },
      { merge: true }
    );

    userDispatch({ type: "SET_DAILY_PROTEIN", payload: updatedProtein });
    userDispatch({ type: "SET_PROTEIN_UPDATES", payload: newProteinUpdates });
  };

  const handleCarbsSubmit = async (e) => {
    e.preventDefault();
    const newCarbs = parseInt(e.target.userCarbs.value, 10);

    console.log("newCarbs values", newCarbs);
    if (isNaN(newCarbs)) {
      alert("Please enter a valid number");
      return;
    }

    const updatedCarbs = userState.dailyCarbs + newCarbs;

    const now = new Date();
    const currentTime = formatTime(now);

    const newCarbsUpdates = [
      ...userState.carbsUpdates,
      { time: currentTime, cumulativeCarbs: updatedCarbs },
    ];

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      {
        dailyCarbs: updatedCarbs,
        carbsUpdates: newCarbsUpdates,
      },
      { merge: true }
    );

    userDispatch({ type: "SET_DAILY_CARBS", payload: updatedCarbs });
    userDispatch({ type: "SET_CARBS_UPDATES", payload: newCarbsUpdates });
  };

  const handleFatsSubmit = async (e) => {
    e.preventDefault();
    const newFats = parseInt(e.target.userFats.value, 10);

    console.log("newFats values", newFats);
    if (isNaN(newFats)) {
      alert("Please enter a valid number");
      return;
    }

    const updatedFats = userState.dailyFats + newFats;

    const now = new Date();
    const currentTime = formatTime(now);

    const newFatsUpdates = [
      ...userState.fatsUpdates,
      { time: currentTime, cumulativeFats: updatedFats },
    ];

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      {
        dailyFats: updatedFats,
        fatsUpdates: newFatsUpdates,
      },
      { merge: true }
    );

    userDispatch({ type: "SET_DAILY_FATS", payload: updatedFats });
    userDispatch({ type: "SET_FATS_UPDATES", payload: newFatsUpdates });
  };

  const handleFiberSubmit = async (e) => {
    e.preventDefault();
    const newFiber = parseInt(e.target.userFiber.value, 10);

    console.log("newFiber values", newFiber);
    if (isNaN(newFiber)) {
      alert("Please enter a valid number");
      return;
    }

    const updatedFiber = userState.dailyFiber + newFiber;

    const now = new Date();
    const currentTime = formatTime(now);

    const newFiberUpdates = [
      ...userState.fiberUpdates,
      { time: currentTime, cumulativeFiber: updatedFiber },
    ];

    // Update Firestore and local state
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      {
        dailyFiber: updatedFiber,
        fiberUpdates: newFiberUpdates,
      },
      { merge: true }
    );

    userDispatch({ type: "SET_DAILY_FIBER", payload: updatedFiber });
    userDispatch({ type: "SET_FIBER_UPDATES", payload: newFiberUpdates });
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
        <canvas ref={calorieChartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleCalorieSubmit}>
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

      <h2 className="calorie-title">Your Daily Protein Intake</h2>
      <p className="calorie-description">
        Based on your information, you should consume approximately{" "}
        {Math.round(protein)} grams of protein per day.
      </p>
      <div className="calorie-chart">
        <canvas ref={proteinChartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleProteinSubmit}>
        <input
          className="calorie-input"
          name="userProtein"
          type="number"
          placeholder="Enter protein"
        />
        <button className="calorie-button" type="submit">
          Update Protein
        </button>
      </form>

      <h2 className="calorie-title">Your Daily Carbohydate Intake</h2>
      <p className="calorie-description">
        Based on your information, you should consume approximately{" "}
        {Math.round(carbs)} grams of carbohydrates per day.
      </p>
      <div className="calorie-chart">
        <canvas ref={carbsChartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleCarbsSubmit}>
        <input
          className="calorie-input"
          name="userCarbs"
          type="number"
          placeholder="Enter carbohydrates"
        />
        <button className="calorie-button" type="submit">
          Update Protein
        </button>
      </form>

      <h2 className="calorie-title">Your Daily Fats Intake</h2>
      <p className="calorie-description">
        Based on your information, you should consume approximately{" "}
        {Math.round(fats)} grams of fat per day.
      </p>
      <div className="calorie-chart">
        <canvas ref={fatsChartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleFatsSubmit}>
        <input
          className="calorie-input"
          name="userFats"
          type="number"
          placeholder="Enter fats"
        />
        <button className="calorie-button" type="submit">
          Update Fats
        </button>
      </form>

      <h2 className="calorie-title">Your Daily Fiber Intake</h2>
      <p className="calorie-description">
        Based on your information, you should consume approximately{" "}
        {Math.round(fiber)} grams of fiber per day.
      </p>
      <div className="calorie-chart">
        <canvas ref={fiberChartRef} />
      </div>
      <form className="calorie-form" onSubmit={handleFiberSubmit}>
        <input
          className="calorie-input"
          name="userFiber"
          s
          type="number"
          placeholder="Enter fiber"
        />
        <button className="calorie-button" type="submit">
          Update Fiber
        </button>
      </form>
    </div>
  );
};

export default CalorieCounter;
