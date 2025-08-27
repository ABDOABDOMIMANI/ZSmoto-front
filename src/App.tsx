"use client"

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Motorcycles from "./pages/Motorcycles"
import Pieces from "./pages/Pieces"
import Clients from "./pages/Clients"
import Orders from "./pages/Orders"
import Workers from "./pages/Workers"
import Deadlines from "./pages/Deadlines"
import Expenses from "./pages/Expenses"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import "./App.css"
import Login from "./authentication/login"

// Simple authentication check (for demo: check localStorage for "authenticated" flag)
function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true"
}

function getRole(): string {
  return localStorage.getItem("role") || "admin"
}

// A wrapper for protected routes
function PrivateRoute({ element }: { element: React.ReactElement }) {
  return isAuthenticated() ? element : <Navigate to="/" replace />
}

function RoleRoute({ element, disallow }: { element: React.ReactElement; disallow?: string[] }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />
  const role = getRole()
  if (disallow && disallow.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  return element
}

// Custom Login wrapper to handle redirect on successful login
function LoginWithRedirect() {
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("authenticated", "true");
    setLoginSuccess(true);
  };

  // Redirect away from login if already authenticated or upon success
  useEffect(() => {
    if (isAuthenticated() || loginSuccess) {
      navigate("/dashboard", { replace: true });
    }
  }, [loginSuccess, navigate]);

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

function CatchAllRoute() {
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Check if current route is login
  const isLoginPage = location.pathname === "/"
  const authed = isAuthenticated()

  // Initialize theme on mount
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const saved = localStorage.getItem('theme:dark')
    if (saved === '1' || (!saved && prefersDark)) {
      document.body.classList.add('dark-theme')
    }
  }, [])

  return (
    <div className="app">
      {authed && !isLoginPage && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className={`content ${authed && !isLoginPage && sidebarOpen ? "content-with-sidebar" : "content-full"}`}>
        {authed && !isLoginPage && <Header toggleSidebar={toggleSidebar} />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginWithRedirect />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/motorcycles" element={<PrivateRoute element={<Motorcycles />} />} />
            <Route path="/pieces" element={<PrivateRoute element={<Pieces />} />} />
            <Route path="/clients" element={<PrivateRoute element={<Clients />} />} />
            <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
            <Route path="/workers" element={<RoleRoute disallow={["limited"]} element={<Workers />} />} />
            <Route path="/deadlines" element={<RoleRoute disallow={["limited"]} element={<Deadlines />} />} />
            <Route path="/expenses" element={<RoleRoute disallow={["limited"]} element={<Expenses />} />} />
            <Route path="*" element={<CatchAllRoute />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
