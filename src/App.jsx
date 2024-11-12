import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import CreateCase from "./components/Createcase.jsx";
import CaseDetails from "./components/CaseDetails.jsx";
import EditProfile from "./components/EditProfile.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-case" element={<CreateCase />} />
          <Route path="/cases/:id" element={<CaseDetails />} />{" "}
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
