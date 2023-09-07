import "../styling/Home.css"
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-title"> 
        Welcome to the Calorie Counter App
      </h2>
      <p className="home-text"> 
        Track your daily calories and reach your health goals!
      </p>
      
      <div className="auth-buttons container"> 
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
