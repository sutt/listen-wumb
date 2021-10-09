import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ControlBar from "./ControlBar";

const YoutubeEmbed = ({ radioData, selectedSong, songId, setSongId }) => {
  const [youTubeData, setYouTubeData] = useState(selectedSong);
  const [onSwitch, setOnSwitch] = useState("true");

  // Fetches youtube data using the 'selectedSong' info
  useEffect(() => {
    
    const base = (process.env.REACT_APP_BACKEND == `local`) 
                  ? `http://localhost:3003/search-yt-api`
                  : `https://wumb-proxy-2.herokuapp.com/search-yt-api`
    
    const trackInfo = {
      time: selectedSong.time,
      date: selectedSong.date,
      title: selectedSong.title,
      artist: selectedSong.artist,
      live: onSwitch,
    }
    const params = Object.entries(trackInfo)
          .reduce((a,b) => {
              return a + b[0] + "=" + encodeURI(b[1]) + "&"
          }, "?" )
    
    const url = base + params

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        window.videodata = data;
        setYouTubeData(data[0].id.videoId);
      })
      .catch(console.error);
  }, [selectedSong, onSwitch]);

  const urlSwitch = () => {
    if (onSwitch === "true") {
      setOnSwitch("false");
    } else {
      setOnSwitch("true");
    }
  };

  if (selectedSong && youTubeData) {
    return (
      <div className="embed-container">
        {/* <button onClick={urlSwitch}>Toggle Live Search</button>
        <div className="true-message">
          <h2> Live search is currently {onSwitch}</h2>
        </div> */}

        <div className="video-container">
          <div className="video-responsive">
            <iframe
              src={`https://www.youtube.com/embed/${youTubeData}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* <iframe src="https://www.youtube.com/embed/VIDEO_ID?playlist=wOwblaKmyVw,ZbZSe6N_BXs" title="YouTube video player playlist" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
          </div>
          <div className="youtube-controler">
            <ControlBar
              radioData={radioData}
              songId={songId}
              setSongId={setSongId}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <div> Loading, please wait!!</div>;
  }
};
YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
