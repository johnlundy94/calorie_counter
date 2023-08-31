import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero">
      <h2>Welcome to the Calorie Counter App</h2>
      <p>Track your daily calories and reach your health goals!</p>
      
      <div className="auth-buttons">
        <Link to="/signin" className="button">
          Sign In
        </Link>
        <Link to="/signup" className="button">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;