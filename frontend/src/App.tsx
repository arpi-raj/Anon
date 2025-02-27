import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import  Home  from "./components/Home";

export default function App() {
  return (
    <RecoilRoot>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
    </RecoilRoot>
  );
}