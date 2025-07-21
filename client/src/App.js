// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './components/Pages/Admin/SidebarContext';
import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/common/Header';
import Login from './components/Pages/Signup/Login';
import RegisterForm from './components/Pages/Signup/RegisterFrom';
import UserTable from './components/Pages/Admin/usersTable';
import UserDetails from './components/Pages/Admin/UserDetails';
import DirectorChart from './components/Pages/Director/DirectorDashboard';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes with Header and dynamic table */}
              <Route
                path="/table"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <UserTable />
                    </>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/table/user-table"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <UserTable />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <>
                    <Header />
                    <DirectorChart />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* UserDetails route */}
              <Route
                path="/user/:id"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <UserDetails />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;