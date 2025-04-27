// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import TaskBoard from "./components/TaskBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
