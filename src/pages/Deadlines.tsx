"use client"

import { useState, useEffect } from "react"
import { Add, Search } from "@mui/icons-material"
import "./EntityPage.css"

const Deadlines = () => {
  const [loading, setLoading] = useState(true)
  const [error] = useState("")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="entity-page">
      <div className="page-header">
        <h1 className="page-title">Deadlines</h1>
        <button className="btn btn-primary">
          <Add /> Add Deadline
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <Search className="search-icon" />
        <input type="text" placeholder="Search deadlines..." className="search-input" />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Deadlines Management</h2>
          </div>
          <p className="p-4">This page is under construction. Deadlines management will be available soon.</p>
        </div>
      )}
    </div>
  )
}

export default Deadlines
