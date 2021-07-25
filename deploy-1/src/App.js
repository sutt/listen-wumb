import "./App.css";
import React, { useContext, useState } from "react";
import Layout from "./components/Layout";
import { DataContext } from "./components/DataContext";

function App() {
  const dataContext = useContext(DataContext);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <div className="App">
      <Layout isLoggedIn={isLoggedIn} username="User123" />
    </div>
  );
}

export default App;
