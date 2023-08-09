import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero">
      <h2>Welcome to the Calorie Counter App</h2>
      <p>Track your daily calories and reach your health goals!</p>
      <Link to="/questions" className="button">
        Click here to get started
      </Link>
    </div>
  );
};

export default Home;