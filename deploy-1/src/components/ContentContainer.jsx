import React, { useEffect, useState } from "react";
import YTE from "./Youtubeembed";
import Table from "./Table";
import Searchbar from "./Searchbar";

const EmbedContainer = () => {
  const today = new Date() // creates todays date
    .toLocaleDateString() // converts to string in (month/date/year) format
    .split("/") // converts to array with 3 items [month,date,year]
    .map((i) => (i = "0" + i)) // adds an extra zero for single digit dates (i.e. may 6th)
    .map((i) => i.slice(-2)); // returns array with with items [mm, dd, yy]

  const [radioData, setRadioData] = useState("");
  const [selectedSong, setSelectedSong] = useState("");
  const [songId, setSongId] = useState("");
  const [searchYear, setSearchYear] = useState(today[2]);
  const [searchMonth, setSearchMonth] = useState(today[0]);
  const [searchDay, setSearchDay] = useState(today[1]);

  // Fetches playlist data from WUMB for a given date
  // Sets 'songId' to 0 which is the latest song played on wumb
  // Runs everytime [searchYear, searchMonth, searchDay] chnages
  useEffect(() => {
    fetch(
      `https://wumb-proxy-2.herokuapp.com/parse?live=true&d=${searchYear}${searchMonth}${searchDay}`
    )
      .then((res) => res.text())
      .then((body) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html");
        const tbs = doc
          .querySelector("#MainContentTextOnly")
          .querySelectorAll("tbody");
        const data = Array.from(tbs).map((tb, i) => {
          return {
            song_id: i,
            time: tb.children[0].children[0].innerText.replaceAll("\n", ""),
            artist: tb.children[0].children[1].innerText.replaceAll("\n", ""),
            title: tb.children[1].innerText.replaceAll("\n", ""),
          };
        });
        setRadioData(data);
        setSongId(data[0].song_id);
      })
      .catch(console.error);
  }, [searchYear, searchMonth, searchDay]);

  // Sets 'selectedSong' to the songId index of radioData
  useEffect(() => {
    setSelectedSong(radioData[songId]);
  }, [radioData, songId]);

  return (
    <div className="embed-container">
      <div className="youtube-player">
        {selectedSong ? (
          <div>
            <YTE
              radioData={radioData}
              selectedSong={selectedSong}
              songId={songId}
              setSongId={setSongId}
            />
          </div>
        ) : null}
      </div>
      
      <div className="table-and-searchbar">
        <div className="searchbar-container">
          {radioData ? (
            <Searchbar
              setSearchYear={setSearchYear}
              setSearchMonth={setSearchMonth}
              setSearchDay={setSearchDay}
            />
          ) : null}
        </div>

        <div className="queue-table">
          <Table
            radioData={radioData}
            searchDay={searchDay}
            searchMonth={searchMonth}
            searchYear={searchYear}
            setSelectedSong={setSelectedSong}
            setSongId={setSongId}
          />
        </div>
      </div>
    </div>
  );
};

export default EmbedContainer;
