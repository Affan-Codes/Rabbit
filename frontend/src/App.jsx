import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />} />
        <Route />
      </Routes>
    </Router>
  );
};

export default App;
