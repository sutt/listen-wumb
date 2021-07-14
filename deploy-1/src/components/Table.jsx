import React, { useState, useEffect } from "react";

function Table({ radioData, searchDay, searchMonth, searchYear }) {
  // const [displayDay, setdisplayDay] = useState("");
  // const [displayMonth, setdisplayMonth] = useState("");
  // const [displayYear, setdisplayYear] = useState("");
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(10);
  const [displayData, setDisplayData] = useState([]);
  // const [num0, setNum0] = useState(0);
  // const [num1, setNum1] = useState(1);
  // const [num2, setNum2] = useState(2);
  // const [num3, setNum3] = useState(3);
  // const [num4, setNum4] = useState(4);
  // const [num5, setNum5] = useState(5);
  // const [num6, setNum6] = useState(6);
  // const [num7, setNum7] = useState(7);
  // const [num8, setNum8] = useState(8);
  // const [num9, setNum9] = useState(9);

  // useEffect(() => {
  //   setdisplayDay(searchDay);
  //   setdisplayMonth(searchMonth);
  //   setdisplayYear(searchYear);
  //   setdisplayData(radioData);
  // }, [searchYear, searchMonth, searchDay, radioData]);

  useEffect(() => {
    const radioDataToDisplay = [];
    for (let i = startRange; i < endRange; i++) {
      if (!radioData[i]) break;
      radioDataToDisplay.push(radioData[i]);
    }
    setDisplayData(radioDataToDisplay);
  }, [startRange, endRange, radioData]);

  const nextBatch = () => {
    // needs an if statement to avoid an error at the end of the list

    // console.log("first", num0, num1, num2);
    // setNum0(num0 + 10);
    // setNum1(num1 + 10);
    // setNum2(num2 + 10);
    // setNum3(num3 + 10);
    // setNum4(num4 + 10);
    // setNum5(num5 + 10);
    // setNum6(num6 + 10);
    // setNum7(num7 + 10);
    // setNum8(num8 + 10);
    // setNum9(num9 + 10);
    // console.log("second", num0, num1, num2);
    setStartRange(startRange + 10);
    setEndRange(endRange + 10);
  };

  const prevBatch = () => {
    if (startRange < 10) {
      alert("Too far, go to next day!");
    } else {
      // console.log("first", num0, num1, num2);
      // setNum0(num0 - 10);
      // setNum1(num1 - 10);
      // setNum2(num2 - 10);
      // setNum3(num3 - 10);
      // setNum4(num4 - 10);
      // setNum5(num5 - 10);
      // setNum6(num6 - 10);
      // setNum7(num7 - 10);
      // setNum8(num8 - 10);
      // setNum9(num9 - 10);
      // console.log("second", num0, num1, num2);
      setStartRange(startRange - 10);
      setEndRange(endRange - 10);
    }
  };

  const tableRows = displayData.map((song) => {
    return (
      <tr key={song.time} className="row">
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
            <button onClick={nextBatch} class="menu-button" id="next-button">
              Click for earlier batch of songs!
            </button>

            <button
              onClick={prevBatch}
              className="menu-button"
              id="prev-button"
            >
              Click for later batch of songs!
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading, Please Wait!!</div>;
  }
}

export default Table;
