import "../../styling/SignIn.css"
import React, { useContext } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../../context/userContext';
import { getDoc, doc } from "firebase/firestore";
import firebaseConfig from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const { db } = firebaseConfig; 

const SignIn = () => {
  const navigate = useNavigate();
  const {userDispatch} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        userDispatch({
          type: 'SET_USER_DATA',
          payload: userData,
        });
      }

      userDispatch({
        type: 'SET_UID',
        payload: user.uid,
      });

      console.log('Signed in:', user);
      navigate('/calorie-counter')
    } catch (error) {
      console.error('Error in sign in:', error);
      window.alert('Error in sign in:', error)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name='email' type='email' placeholder='Email' required/>
      <input name='password' type='password' placeholder='Password' required/>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;