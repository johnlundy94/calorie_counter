import { createContext } from "react";

export const UserContext = createContext();
export const FirebaseContext = createContext();

export const initialUserState = {
  uid: "",
  sex: "",
  height: 0,
  weight: 0,
  exercise: "",
  goal: "",
  meals: [],
  age: 0,
  tdee: 0,
  todayCalories: 0,
  calorieUpdates: [],
  dailyProtein: 0,
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEX":
      return { ...state, sex: action.payload };
    case "SET_HEIGHT":
      return { ...state, height: action.payload };
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "SET_EXERCISE":
      return { ...state, exercise: action.payload };
    case "SET_GOAL":
      return { ...state, goal: action.payload };
    case "SET_AGE":
      return { ...state, age: action.payload };
    case "ADD_MEAL":
      return { ...state, meals: [...state.meals, action.payload] };
    case "SET_TDEE":
      return { ...state, tdee: action.payload };
    case "SET_UID":
      return { ...state, uid: action.payload };
    case "SET_USER_DATA":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return initialUserState;
    case "SET_TODAY_CALORIES":
      return { ...state, todayCalories: action.payload };
    case "SET_CALORIE_UPDATES":
      return { ...state, calorieUpdates: action.payload };
    case "SET_DAILY_PROTEIN":
      return { ...state, dailyProtein: action.payload };
    default:
      return state;
  }
};
