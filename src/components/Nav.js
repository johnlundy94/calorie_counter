import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { UserContext } from "../context/userContext";

const Nav = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("Current User State:", userState);

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User Logged Out Successfully");
        userDispatch({ type: "LOGOUT" });
        navigate("/")
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="nav">
      {userState.uid ? (
        <>
          <button onClick={handleLogOut}>Log Out</button>
        </>
      ) : null}
    </div>
  );
};

export default Nav;
