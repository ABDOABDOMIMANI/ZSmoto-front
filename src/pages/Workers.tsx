"use client"

import { useState, useEffect } from "react"
import { Add, Search } from "@mui/icons-material"
import "./EntityPage.css"

const Workers = () => {
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
        <h1 className="page-title">Workers</h1>
        <button className="btn btn-primary">
          <Add /> Add Worker
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <Search className="search-icon" />
        <input type="text" placeholder="Search workers..." className="search-input" />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Workers Management</h2>
          </div>
          <p className="p-4">This page is under construction. Workers management will be available soon.</p>
        </div>
      )}
    </div>
  )
}

export default Workers
