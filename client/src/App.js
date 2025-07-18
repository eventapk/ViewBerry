// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/common/Header';
import Login from './components/Pages/Signup/Login';
import RegisterForm from './components/Pages/Signup/RegisterFrom';
import UserTable from './components/Pages/Admin/usersTable';
import UserDetails from './components/Pages/Admin/UserDetails'; // Import your UserDetails component

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RegisterForm />} />
            <Route path="/login" element={<Login />} />
            
            
            {/* Protected Routes */}
            <Route
              path="/table"
              element={
                <ProtectedRoute>
                  <UserTable />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/table/user-table"
              element={
                <ProtectedRoute>
                  <UserTable />
                </ProtectedRoute>
              }
            />

            {/* Add the UserDetails route */}
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            
            {/* Optional: Redirect root to login or table */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <UserTable />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;