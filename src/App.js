import React, { useReducer } from 'react';
import "./App.css";
import Home from "./pages/Home";
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CalorieCounter from "./pages/CalorieCounter";
import Questions from "./pages/Questions";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext, initialUserState, userReducer } from './context/userContext';
import db from './config/firebase';
import Nav from './components/Nav';

function App() {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);
  console.log("App.js UserState:", userState);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <Router>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/calorie-counter" element={<CalorieCounter />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
