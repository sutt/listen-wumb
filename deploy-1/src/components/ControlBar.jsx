import React, { useState } from "react";

function ControlBar({ songId, setSongId, radioData }) {
  var YoutubePlayer = document.getElementsByTagName("iframe")[0];
  console.log(YoutubePlayer);
  const [videoIsPaused, setVideoIsPaused] = useState(true);

  function nextVideo() {
    if (songId === radioData.length - 1) {
      console.log("No next song to play");
    } else {
      // removes 'selected className from the current row
      const currentSelectedRow = document.getElementById(`song_${songId}`);
      if (currentSelectedRow) {
        currentSelectedRow.classList.remove("selected");
      } else {
        console.log(`FAILED TO GET CURRENT SONG by ElementId 'song_${songId}'`);
      }

      // adds 'selected' className to the next row
      const nextRow = document.getElementById(`song_${songId + 1}`);
      if (nextRow) {
        nextRow.classList.add("selected");
      } else {
        console.log(
          `FAILED TO GET NEXT SONG by ElementId 'song_${songId + 1}'`
        );
      }

      // sets new song to play
      setSongId(songId + 1);
    }
  }
  function previousVideo() {
    if (songId === 0) {
      console.log("No next song to play");
    } else {
      // removes 'selected className from the current row
      const currentSelectedRow = document.getElementById(`song_${songId}`);
      if (currentSelectedRow) {
        currentSelectedRow.classList.remove("selected");
      } else {
        console.log(`FAILED TO GET CURRENT SONG by ElementId 'song_${songId}'`);
      }

      // adds 'selected' className to the previous row
      const previousRow = document.getElementById(`song_${songId - 1}`);
      if (previousRow) {
        previousRow.classList.add("selected");
      } else {
        console.log(
          `FAILED TO GET NEXT SONG by ElementId 'song_${songId - 1}'`
        );
      }

      // sets new song to play
      setSongId(songId - 1);
    }
  }

  // function playPauseVideo() {
  //   if (!videoIsPaused) {
  //     YoutubePlayer.pauseVideo();
  //     setVideoIsPaused(true);
  //     console.log("video paused");
  //   } else {
  //     YoutubePlayer.playVideo();
  //     setVideoIsPaused(false);
  //     console.log("video playing");
  //   }
  // }

  return (
    <div id="controlbar" className="controlbar">
      <button onClick={previousVideo} className="cal-button ">
        {"|<"}
      </button>
      {/* <button onClick={playPauseVideo} class="cal-button">
        {videoIsPaused ? "Play" : "Pause"}
      </button> */}
      <button onClick={nextVideo} className="cal-button">
      {">|"}
      </button>
    </div>
  );
}

export default ControlBar;
