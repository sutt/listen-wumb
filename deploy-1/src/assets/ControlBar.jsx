import React from "react";

//we have 'player' here for the player, but the embed component uses a diffeerent terminology.
//ergo, we will have to connect the two eventually and change some wordage.
//But between the fetch command and the date/time setup, these are 4th or 5th in our task agenda heirarchy.

function ControlBar() {
  var player;
  var currentVidIndex = 0;

  function nextVideo() {
    currentVidIndex++;
    // player.loadVideoById(vids[currentVidIndex])
    player.playVideo();
    // setHighlightClass()
    console.log("next video", currentVidIndex);
  }

  function previousVideo() {
    currentVidIndex--;
    // player.loadVideoById(vids[currentVidIndex])
    player.playVideo();
    // setHighlightClass()
    console.log("previous video", currentVidIndex);
  }

  function setVideoIndex(index) {
    currentVidIndex = index;
    // player.loadVideoById(vids[currentVidIndex])
    player.playVideo();
    // setHighlightClass()
    console.log(currentVidIndex);
  }

  function pauseVideo() {
    player.pauseVideo();
    console.log("video paused");
  }

  function playVideo() {
    player.playVideo();
    console.log("video played");
  }

  return (
    <div>
      <div id="controlbar" className="controlbar">
        <button onClick={previousVideo}>Prev</button>
        <button onClick={nextVideo}>Next </button>
        <button onClick={playVideo}>Play</button>
        <button onClick={pauseVideo}>Pause</button>
      </div>
    </div>
  );
}

export default ControlBar;
