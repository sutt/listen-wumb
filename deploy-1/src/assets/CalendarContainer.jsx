import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";

function CalContainer({
  handleDateSubmit,
  setSearchYear,
  setSearchMonth,
  setSearchDay,
}) {
  const [showModal, setShowModal] = useState(false);
  const openCalendar = () => {
    setShowModal(true);
  };

  const closeCalendar = () => {
    setShowModal(false);
  };

  if (!showModal) {
    return (
      <div className="cal-container">
        <button id="openModal" className="cal-button" onClick={openCalendar}>
          Open Calendar
        </button>
      </div>
    );
  } else {
    return (
      <div className="cal-container">
        <button id="openModal" onClick={closeCalendar}>
          Close Calendar
        </button>
        <div className="cal-start">
          <Calendar
            onClick={handleDateSubmit}
            {...{ setSearchYear, setSearchMonth, setSearchDay }}
          />
        </div>
      </div>
    );
  }
}

export default CalContainer;
