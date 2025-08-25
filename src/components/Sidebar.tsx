"use client"

import { Link, useLocation } from "react-router-dom"
import {
  Home,
  
  Settings,
  People,
  ShoppingCart,
  Person,
  AccessTime,
  AttachMoney,
  ChevronLeft,
  TwoWheeler,
} from "@mui/icons-material"
import "./Sidebar.css"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  // Close sidebar when route changes (mobile UX)
  const prevPathRef = (globalThis as any).__prevPathRef || { current: location.pathname }
  ;(globalThis as any).__prevPathRef = prevPathRef
  if (prevPathRef.current !== location.pathname && isOpen) {
    // best-effort: close on navigation for small screens
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      toggleSidebar()
    }
    prevPathRef.current = location.pathname
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Moto Inventory</h2>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronLeft />
        </button>
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${isActive("/")}`}>
            <Link to="/dashboard" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <Home className="sidebar-icon" />
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/motorcycles")}`}>
            <Link to="/motorcycles" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <TwoWheeler className="sidebar-icon" />
              <span className="sidebar-text">Motorcycles</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/pieces")}`}>
            <Link to="/pieces" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <Settings className="sidebar-icon" />
              <span className="sidebar-text">Pieces</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/clients")}`}>
            <Link to="/clients" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <People className="sidebar-icon" />
              <span className="sidebar-text">Clients</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/orders")}`}>
            <Link to="/orders" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <ShoppingCart className="sidebar-icon" />
              <span className="sidebar-text">Orders</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/workers")}`}>
            <Link to="/workers" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <Person className="sidebar-icon" />
              <span className="sidebar-text">Workers</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/deadlines")}`}>
            <Link to="/deadlines" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <AccessTime className="sidebar-icon" />
              <span className="sidebar-text">Deadlines</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/expenses")}`}>
            <Link to="/expenses" className="sidebar-link" onClick={() => {
              if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) toggleSidebar()
            }}>
              <AttachMoney className="sidebar-icon" />
              <span className="sidebar-text">Expenses</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>© 2023 Moto Inventory</p>
      </div>
    </div>
  )
}

export default Sidebar
