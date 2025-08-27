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
import logoPng from "../assets/images/logo.png"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : ""
  }

  const role = (typeof localStorage !== "undefined" && localStorage.getItem("role")) || "admin"

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img src={logoPng} alt="Logo" className="sidebar-logo" />
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronLeft />
        </button>
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${isActive("/")}`}>
            <Link to="/dashboard" className="sidebar-link">
              <Home className="sidebar-icon" />
              <span className="sidebar-text">Dashboard</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/motorcycles")}`}>
            <Link to="/motorcycles" className="sidebar-link">
              <TwoWheeler className="sidebar-icon" />
              <span className="sidebar-text">Motorcycles</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/pieces")}`}>
            <Link to="/pieces" className="sidebar-link">
              <Settings className="sidebar-icon" />
              <span className="sidebar-text">Pieces</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/clients")}`}>
            <Link to="/clients" className="sidebar-link">
              <People className="sidebar-icon" />
              <span className="sidebar-text">Clients</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/orders")}`}>
            <Link to="/orders" className="sidebar-link">
              <ShoppingCart className="sidebar-icon" />
              <span className="sidebar-text">Orders</span>
            </Link>
          </li>
          {role !== "limited" && (
            <>
              <li className={`sidebar-item ${isActive("/workers")}`}>
                <Link to="/workers" className="sidebar-link">
                  <Person className="sidebar-icon" />
                  <span className="sidebar-text">Workers</span>
                </Link>
              </li>
              <li className={`sidebar-item ${isActive("/deadlines")}`}>
                <Link to="/deadlines" className="sidebar-link">
                  <AccessTime className="sidebar-icon" />
                  <span className="sidebar-text">Deadlines</span>
                </Link>
              </li>
              <li className={`sidebar-item ${isActive("/expenses")}`}>
                <Link to="/expenses" className="sidebar-link">
                  <AttachMoney className="sidebar-icon" />
                  <span className="sidebar-text">Expenses</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>© 2023 Moto Inventory</p>
      </div>
    </div>
  )
}

export default Sidebar
