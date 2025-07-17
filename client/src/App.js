// src/App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RegisterFrom from './components/Pages/Signup/RegisterFrom';
import Login from './components/Pages/Signup/Login';
import UserDetails from './components/Pages/Admin/UserDetails';
import UsersTable from './components/Pages/Admin/usersTable';

function App() {
  return (
    <div className="App">
      <nav style={styles.navbar}>
        <Link to="/" style={styles.link}>Register</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/table" style={styles.link}>Users Table</Link>
      </nav>

      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<RegisterFrom />} />
          <Route path="/login" element={<Login />} />
          <Route path="/table" element={<UsersTable />} />
          <Route path="/user/:id" element={<UserDetails />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    padding: "10px 20px",
    background: "#2575fc",
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  container: {
    padding: "20px",
  },
};

export default App;
