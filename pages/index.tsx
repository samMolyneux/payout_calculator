import type React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { GamePage, Home, TransactionsPage } from "../containers/pages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/transactions/game/:gameId" element={<TransactionsPage />} />
      </Routes>
    </Router>
  );
}