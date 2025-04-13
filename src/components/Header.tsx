"use client"

import { useState } from "react"
import { Menu, Notifications, AccountCircle } from "@mui/icons-material"
import "./Header.css"

interface HeaderProps {
  toggleSidebar: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-button" onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>
      <div className="header-right">
        <button className="header-icon-button">
          <Notifications />
        </button>
        <div className="header-profile">
          <button className="header-profile-button" onClick={toggleProfileMenu}>
            <AccountCircle />
            <span className="header-profile-name">Admin</span>
          </button>
          {showProfileMenu && (
            <div className="header-profile-menu">
              <ul>
                <li>
                  <a href="#">Profile</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
