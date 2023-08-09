import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const CalorieCounter = () => {
  const { userState } = useContext(UserContext);
  const { tdee } = userState;

  return (
    <div>
      <h2>Your Daily Calorie Intake</h2>
      <p>Based on your information, you should consume approximately {Math.round(tdee)} calories per day.</p>

    </div>
  );
};

export default CalorieCounter;