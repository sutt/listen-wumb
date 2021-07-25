import React, { useState, useEffect } from "react";
import FF from "../assets/FF.png";
import RW from "../assets/RW.png";
import Record from "../assets/Record.gif";

function Table({ radioData, searchDay, searchMonth, searchYear, setSongId }) {
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(10);
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const radioDataToDisplay = [];
    for (let i = startRange; i < endRange; i++) {
      if (!radioData[i]) break;
      radioDataToDisplay.push(radioData[i]);
    }
    setDisplayData(radioDataToDisplay);
    setSongId(startRange);
  }, [startRange, endRange, radioData]);

  const prevBatch = () => {
    if (startRange > radioData.length - 11) {
      alert("Too early, go to previous day!");
    } else {
      setStartRange(startRange + 10);
      setEndRange(endRange + 10);
    }
  };

  const nextBatch = () => {
    if (startRange < 10) {
      alert("Too far, go to next day!");
    } else {
      setStartRange(startRange - 10);
      setEndRange(endRange - 10);
    }
  };

  const handleClickRow = (e) => {
    e.preventDefault();
    // removes 'selected' from className of all <tr> tags
    const allRows = document.getElementsByClassName("row");
    for (let i = 0; i < allRows.length; i++) {
      allRows[i].classList.remove("selected");
    }

    // adds 'selected' to the className of the clicked <tr>
    const rowElement = e.target.parentNode;
    rowElement.classList.add("selected");

    // sets the selected song
    const song_id = e.target.parentNode.id.replace("song_", "");
    setSongId(song_id);
  };

  const tableRows = displayData.map((song, i) => {
    if (i === 0)
      return (
        <tr
          key={song.time}
          className="row selected"
          id={"song_" + song.song_id}
          onClick={handleClickRow}
        >
          <td>{song.time}</td>
          <td>{song.artist}</td>
          <td>{song.title}</td>
        </tr>
      );
    return (
      <tr
        key={song.time}
        className="row"
        id={"song_" + song.song_id}
        onClick={handleClickRow}
      >
        <td>{song.time}</td>
        <td>{song.artist}</td>
        <td>{song.title}</td>
      </tr>
    );
  });

  if (displayData.length && searchDay && searchMonth) {
    return (
      <div className="table-container">
        <div className="table">
          <h2>
            {searchMonth}/{searchDay}/20{searchYear},{" "}
            {displayData[displayData.length - 1].time} - {displayData[0].time}
          </h2>

          <table>
            <thead>
              <tr className="table-header">
                <th>Time</th>
                <th>Artist</th>
                <th>Title</th>
              </tr>
            </thead>

            <tbody>{tableRows}</tbody>
          </table>

          <div className="buttons">
            <button
              onClick={prevBatch}
              className="arrow-button"
              id="prev-button"
            >
              <img src={RW} alt="rw-icon" className="icon-button" />
            </button>

            <button
              onClick={nextBatch}
              className="arrow-button"
              id="next-button"
            >
              <img src={FF} alt="ff-icon" className="icon-button" />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <img src={Record} alt="record" id="record" />
      </div>
    );
  }
}

export default Table;
