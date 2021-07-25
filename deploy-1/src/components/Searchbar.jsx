import React, { useState } from "react";
import CalendarContainer from "../assets/CalendarContainer";

function Searchbar({ setSearchYear, setSearchMonth, setSearchDay }) {
  const [dateInput, setDateInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // TODO: Do we take away the search function completely, and have the page reload onClick of the date?
  const searchWUMB = (e) => {
    setSearchYear(dateInput[0].substring(2));
    setSearchMonth(dateInput[1]);
    setSearchDay(dateInput[2]);
  };

  const handleDateClick = (e) => {
    e.preventDefault();
    const searchDate = e.target.value.split("-");
    console.log(`searchDate: ${searchDate}`);
    setDateInput(searchDate);
  };

  const toggleCalendar = (e) => {
    e.preventDefault();
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="searchbar-container">
      {/* <div className="calendar">
          <CalendarContainer
            {...{ setSearchYear, setSearchMonth, setSearchDay }}
          />
        </div> */}

      
      
        <div className ="input-container">
          <input className = "date-input" type="date" label="date" onChange={handleDateClick} />
          <button className="search-button" onClick={searchWUMB}>
            Search
          </button>
         </div> 
      </div>
  )
}

export default Searchbar;
