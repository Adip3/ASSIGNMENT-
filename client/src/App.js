// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/PrivateRoute";

// Import your components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import Jobs from "./components/Jobs/Jobs";
import Network from "./components/Network/Network";
import Messages from "./components/Messages/Messages";
import Notifications from "./components/Notifications/Notifications";
import AdminDashboard from "./components/Admin/Dashboard";

// Public Route wrapper - redirects to home if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="profile/:id?" element={<Profile />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="network" element={<Network />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />

              {/* Admin Routes */}
              <Route
                path="admin/*"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback Routes */}
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
