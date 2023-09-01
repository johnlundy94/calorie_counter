import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../config/firebase';
import { UserContext } from '../../context/userContext';
import {doc, setDoc} from "firebase/firestore";

const { db, auth } = firebaseConfig;

const SignUp = () => {
  const navigate = useNavigate();
  const {userDispatch} = useContext(UserContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        tdee: 0,
      })

      userDispatch({
        type: 'SET_UID',
        payload: user.uid,
      });

      console.log('Account created:', user);
      navigate('/questions')
    } catch (error) {
      console.error('Error in signup:', error);
      window.alert('Error in signup:', error)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='email' type='email' placeholder='Email' required/>
      <input name='password' type='password' placeholder='Password' required/>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;