import "../styling/Questions.css";
import Nav from "../components/Nav";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { doc, updateDoc } from "firebase/firestore";
import firebaseConfig from "../config/firebase";

const { db } = firebaseConfig;

const Questions = () => {
  const navigate = useNavigate();
  const { userState, userDispatch } = useContext(UserContext);
  const [gender, setGender] = useState("");
  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);
  const [weight, setWeight] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [exerciseDays, setExerciseDays] = useState(0);
  const [age, setAge] = useState(0);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const heightInCm = feet * 30.48 + inches * 2.54;

    const bmr = calculateBMR(gender, weight, heightInCm, age);
    const tdee = calculateTDEE(bmr, exerciseMinutes, exerciseDays);
    const protein = calculateProtein(weight, exerciseMinutes, exerciseDays);
    const carbs = calculateCarbs(tdee, exerciseMinutes, exerciseDays);

    userDispatch({ type: "SET_SEX", payload: gender });
    userDispatch({ type: "SET_HEIGHT", payload: heightInCm });
    userDispatch({ type: "SET_WEIGHT", payload: weight });
    userDispatch({ type: "SET_EXERCISE", payload: exerciseMinutes });
    userDispatch({ type: "SET_GOAL", payload: exerciseDays });
    userDispatch({ type: "SET_AGE", payload: age });
    userDispatch({ type: "SET_TDEE", payload: tdee });
    userDispatch({ type: "SET_PROTEIN", payload: protein });
    userDispatch({ type: "SET_CARBS", payload: carbs });

    const userDoc = doc(db, "users", userState.uid);
    await updateDoc(userDoc, {
      tdee: tdee,
      protein: protein,
      carbs: carbs,
    });
    navigate("/calorie-counter");
  };

  const calculateBMR = (gender, weight, height, age) => {
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr;
  };

  const calculateTDEE = (bmr, exerciseMinutes, exerciseDays) => {
    const activityMultiplier = getActivityMultiplier(
      exerciseMinutes,
      exerciseDays
    );
    const tdee = bmr * activityMultiplier;
    return tdee;
  };

  const calculateProtein = (weight, exerciseMinutes, exerciseDays) => {
    const weightInKg = weight * 0.45359237;
    const activityMultiplier = getActivityMultiplier(
      exerciseMinutes,
      exerciseDays
    );
    let proteinPerKg = 0.8;
    if (activityMultiplier > 1.2 && activityMultiplier < 1.55) {
      proteinPerKg = 1.2;
    }
    if (activityMultiplier >= 1.55) {
      proteinPerKg = 1.5;
    }
    const dailyProtein = weightInKg * proteinPerKg;
    return Math.round(dailyProtein);
  };

  const calculateCarbs = (tdee, exerciseMinutes, exerciseDays) => {
    const activityMultiplier = getActivityMultiplier(
      exerciseMinutes,
      exerciseDays
    );
    let percentageOfCarbs;

    if (activityMultiplier >= 1.55) {
      percentageOfCarbs = 0.6;
    } else if (activityMultiplier > 1 && activityMultiplier < 1.55) {
      percentageOfCarbs = 0.55;
    } else {
      percentageOfCarbs = 0.45;
    }

    const caloriesFromCarbs = tdee * percentageOfCarbs;
    const dailyCarbs = caloriesFromCarbs / 4;
    return Math.round(dailyCarbs);
  };

  const getActivityMultiplier = (exerciseMinutes, exerciseDays) => {
    if (exerciseMinutes >= 150 && exerciseDays >= 3) {
      return 1.55; // Moderate exercise/sports 3-5 days/week
    } else if (exerciseMinutes >= 75 && exerciseDays >= 1) {
      return 1.375; // Light exercise/sports 1-3 days/week
    } else {
      return 1.2; // Sedentary (little to no exercise)
    }
  };

  return (
    <div className="questions-container">
      <Nav className="questions-nav" />
      <h2 className="questions-title">
        Answer a few questions to get started:
      </h2>
      <form className="questions-form" onSubmit={handleFormSubmit}>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <br />
        <label>
          Height:
          <div>
            <input
              type="number"
              value={feet}
              onChange={(e) => setFeet(parseInt(e.target.value, 10))}
            />
            feet
          </div>
          <div>
            <input
              type="number"
              value={inches}
              onChange={(e) => setInches(parseInt(e.target.value, 10))}
            />
            inches
          </div>
        </label>
        <br />
        <label>
          Weight (in lbs):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value, 10))}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
        </label>
        <br />
        <label>
          Exercise (elevated heartbeat):
          <div>
            <label>
              Minutes per day:
              <input
                type="number"
                value={exerciseMinutes}
                onChange={(e) =>
                  setExerciseMinutes(parseInt(e.target.value, 10))
                }
              />
            </label>
          </div>
          <div>
            <label>
              Days per week:
              <input
                type="number"
                value={exerciseDays}
                onChange={(e) => setExerciseDays(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
        </label>
        <br />
        <button
          className="questions-button"
          type="submit"
          disabled={
            !gender ||
            !feet ||
            !inches ||
            !weight ||
            !age ||
            !exerciseMinutes ||
            !exerciseDays
          }
        >
          Start Tracking
        </button>
      </form>
    </div>
  );
};

export default Questions;
