import "../../styling/SignIn.css";
import React, { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../../context/userContext";
import { getDoc, doc } from "firebase/firestore";
import firebaseConfig from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const { db } = firebaseConfig;

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { userDispatch } = useContext(UserContext);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  handleEmailChange = (e) => {
    const email = e.target.value;
    if (!validateEmail(email) && email) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const email = e.target.email.value;
    const password = e.target.password.value;

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        userDispatch({
          type: "SET_USER_DATA",
          payload: userData,
        });
      }

      userDispatch({
        type: "SET_UID",
        payload: user.uid,
      });

      navigate("/calorie-counter");
    } catch (error) {
      console.error("Error in sign in:", error);
      setErrorMessage("Incorrect email or password");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default SignIn;
