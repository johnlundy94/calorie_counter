import "../../styling/SignUp.css";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../../config/firebase";
import { UserContext } from "../../context/userContext";
import { doc, setDoc } from "firebase/firestore";

const { db, auth } = firebaseConfig;

const SignUp = () => {
  const navigate = useNavigate();
  const { userDispatch } = useContext(UserContext);

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!emailValid || !passwordValid) {
      alert("Please correct the errors before submitting.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        tdee: 0,
      });

      userDispatch({
        type: "SET_UID",
        payload: user.uid,
      });

      console.log("Account created:", user);
      navigate("/questions");
    } catch (error) {
      console.error("Error in signup:", error);
      window.alert("Error in signup:", error);
    }
  };

  const handleEmailChange = (e) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailValid(emailRegex.test(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPasswordValid(e.target.value.length >= 8);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        onChange={handleEmailChange}
        className={emailValid ? "" : "invalid-input"}
      />
      {!emailValid && (
        <p className="error-text">Please enter a valid email address.</p>
      )}
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        minLength="8"
        onChange={handlePasswordChange}
        className={passwordValid ? "" : "invalid-input"}
      />
      {!passwordValid && (
        <p className="error-text">Password must be at least 8 characters.</p>
      )}

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
