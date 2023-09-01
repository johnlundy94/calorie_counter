import React, { useContext } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../config/firebase';
import { UserContext } from '../../context/userContext';

const { auth } = firebaseConfig;

const SignUp = () => {
  const {userDispatch} = useContext(UserContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      userDispatch({
        type: 'SET_UID',
        payload: user.uid,
      });

      console.log('Account created:', user);
      window.alert('Account created:', user)
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