import "../styling/SignUpPage.css"
import React from 'react';
import SignUp from '../components/auth/SignUp';

const SignUpPage = () => {
  return (
    <div className="sign-up-page-container">
      <h1>Sign Up Page</h1>
      <SignUp />
    </div>
  );
};

export default SignUpPage;