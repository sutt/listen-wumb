import React from "react";
import { Link } from "react-router-dom";

//Nav bar that will display differently based on user login status
//as discussed in previous components, this will probably need to have Context added to it eventually.
function Nav(isLoggedIn, setisLoggedIn, username) {
  const logout = () => setisLoggedIn(false);

  if (!isLoggedIn) {
    return (
      <div className="nav">
        <Link to="/">
          {" "}
          <h3 id="nav-link"> Home </h3>{" "}
        </Link>
        <Link to="/login">
          {" "}
          <h3 id="nav-link"> Log In </h3>
        </Link>
        <Link to="/register">
          {" "}
          <h3 id="nav-link"> Create Account </h3>{" "}
        </Link>
      </div>
    );
  } else {
    return (
      <div className="nav">
        <Link to="/">
          {" "}
          <h3 id="nav-link"> Home </h3>{" "}
        </Link>
        <h3 id="nav-link"> Welcome {username}!</h3>
        <button id="logout-button" onClick={logout}>
          <h3 id="nav-link">Log Out</h3>
        </button>
      </div>
    );
  }
}

export default Nav;
