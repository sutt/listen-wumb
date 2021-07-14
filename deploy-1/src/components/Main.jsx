import React from "react";
import { Route } from "react-router-dom";
import ContentContainer from "./ContentContainer";
import Home from "./Home"
import Login from "../forms/Login";
import Register from "../forms/Register";

//our Main component, nested within Layout from App. This will contain all of our site content -> 
//YT player, playlist table, + all command buttons and search options


//trying to get it to display different if logged in or not, and also giving a number of guard operators
//because of how many async fetch functions are going to be done in the child components of Main here
//Because our Log In/Register components here are going to effect the components in the header,
//we are probably going to have to add Context into this


function Main(isLoggedIn, youtubeLink) {


  if (!isLoggedIn) {
    return <div>Please log in!</div>;
  } else {
    //   if(!youtubeLink) {
    //     return (
    //         <div>Loading, please wait!</div>
    //     )
    //   } else {
    return (
      <div className="main-container">

 <div className="main">
        <Route exact path="/login"
               render={(props) => <Login {...props} />} />
        <Route exact path="/register"
          render={(props) => <Register {...props} />}/>
        <Route exact path="/player"
          render={(props) => <ContentContainer embedId={youtubeLink} />}/>
        <Route exact path="/" component={Home}/>
    </div>
  

      </div>
    );
  }
}
export default Main;
