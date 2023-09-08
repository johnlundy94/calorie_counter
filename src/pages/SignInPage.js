import "../styling/SignInPage.css"
import React from 'react';
import SignIn from '../components/auth/SignIn';

const SignInPage = () => {
  return (
    <div className="sign-in-page-container">
      <h1>Sign In Page</h1>
      <SignIn />
    </div>
  );
};

export default SignInPage;