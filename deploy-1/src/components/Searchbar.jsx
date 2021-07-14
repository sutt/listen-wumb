import React, { useState, useEffect } from "react";
import CalendarContainer from "../assets/CalendarContainer";

function Searchbar({ setSearchYear, setSearchMonth, setSearchDay }) {
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [minuteTime, setMinuteTime] = useState("");
  const [hourTime, setHourTime] = useState("");
  const [ytTime, setYtTime] = useState("");

  const searchWUMB = (e) => {
    e.preventDefault();
    setSearchYear(dateInput[0].substring(2));
    setSearchMonth(dateInput[1]);
    setSearchDay(dateInput[2]);
  };

  const handleDateClick = (e) => {
    e.preventDefault();
    const dateInput = e.target.value.split("-");
    console.log(`dateInput: ${dateInput}`);
    setDateInput(dateInput);
  };

  // const handleTimeClick = (evt) => {
  //   evt.preventDefault();
  //   setYtTime(evt.target.value);

  // };
  // const handleTimeSubmit = (evt) => {
  //   evt.preventDefault()
  //   setYtTime(evt.target.value);
  //   console.log('searchbar', ytTime)
  // };

  // console.log(ytTime)
  // console.log(ytTime.slice(3, 5))
  // console.log(ytTime.slice(0, 2) )

  // useEffect(() => {

  //   const handleTimeSubmit = (evt) => {
  //     evt.preventDefault()
  //     setYtTime(evt.target.value);
  //     console.log('searchbar', ytTime)
  //   };

  //   setMinuteTime(ytTime.slice(3, 5))
  //   setHourTime(ytTime.slice(0, 2))
  //   console.log(hourTime, minuteTime)
  // }, [hourTime, minuteTime])

  return (
    <div className="searchbar-container">
      <div className="controlbar">
        <div className="calendar">
          <CalendarContainer
            {...{ setSearchYear, setSearchMonth, setSearchDay }}
          />
        </div>

        {/* <input type="time"
                label="time"
                value={ytTime}
                onChange={handleTimeSubmit}/> 
              

         <input type="date"
               label="date" 
               onChange={handleDateClick} /> */}

        {/* <button className="search-button" onClick={searchWUMB}>
          Search WUMB Playlist
        </button>
         */}
      </div>
    </div>
  );
}

export default Searchbar;
