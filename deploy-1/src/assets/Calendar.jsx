import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarReact({
  setSearchYear,
  setSearchMonth,
  setSearchDay,
}) {
  const [calDate, setCalDate] = useState(new Date(Date.parse("2021-06-01")));
  const [cutDate, setCutDate] = useState("");

  useEffect(() => {
    setSearchDay(calDate.getDate().toString().padStart(2, 0));
    setSearchMonth((calDate.getMonth() + 1).toString().padStart(2, 0));
    window.caldate = calDate;
  }, [calDate, setSearchDay, setSearchMonth]);

  const dateData = (newDate) => {
    setCalDate(newDate);
  };

  return (
    <div className="result-calendar">
      <Calendar onChange={dateData} value={calDate} />
    </div>
  );
}
