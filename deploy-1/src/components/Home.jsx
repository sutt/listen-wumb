import React from "react";
import { Link } from "react-router-dom";

//dummy landing page with link to the YT player.
//more likely than not going to go through a major face lift between now and deployment

//ideally there will be some variation for users loggedin or not.
//But have not reached that bridge to cross yet

function Home(props) {
  return (
    <div className="home-screen-container">
      <div className="home-text-container">
        <h2> Welcome to the WUMB Listen app!</h2>
      </div>

      <div className="player-link">
        <Link to="/player">
          {" "}
          <h2> Go to Youtube Player! </h2>
        </Link>
      </div>
    </div>
  );
}

export default Home;
