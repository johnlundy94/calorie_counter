import React, { useContext } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../../context/userContext';


const SignIn = () => {
  const {userDispatch} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      userDispatch({
        type: 'Set_UID',
        payload: user.uid,
      });

      console.log('Signed in:', user);
      window.alert('Signed in:', user)
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