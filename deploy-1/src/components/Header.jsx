import React from "react";
// import Nav from "./Nav";

//Nothing too exciting here, but will have alternate displays in Nav if user is logged in or not.
//Thinking that this willrequire UseContext
function Header(isLoggedIn, setisLoggedIn, username) {
  return (
    <div className="header-container">

      <div className="header-text">
        <h1 id="header-title"> WUMB - listen </h1>
      </div>

      <div className="header-text2">
        <h2 id ="search-text">Search historical playlists on WUMB radio </h2>
        </div>
    </div>
  );
}

export default Header;
