"use client"

import { Menu, DarkMode, LightMode } from "@mui/icons-material"
import "./Header.css"

interface HeaderProps {
  toggleSidebar: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const isDark = typeof document !== "undefined" && document.body.classList.contains("dark-theme")

  const toggleTheme = () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme")
      localStorage.removeItem("theme:dark")
    } else {
      document.body.classList.add("dark-theme")
      localStorage.setItem("theme:dark", "1")
    }
  }
  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-button" onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>
      <div className="header-right">
        <button className="header-icon-button" onClick={toggleTheme} title="Toggle theme">
          {isDark ? <LightMode /> : <DarkMode />}
        </button>
        <button
          className="header-icon-button"
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              localStorage.removeItem("authenticated");
              localStorage.removeItem("role");
              window.location.replace("/");
            }
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
