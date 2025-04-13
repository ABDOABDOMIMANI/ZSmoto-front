"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`content ${sidebarOpen ? "content-with-sidebar" : "content-full"}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/motorcycles" element={<Motorcycles />} />
              <Route path="/pieces" element={<Pieces />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="/expenses" element={<Expenses />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
