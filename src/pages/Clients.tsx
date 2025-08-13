"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Add, Edit, Delete, Search, Close } from "@mui/icons-material"
import { clientApi } from "../services/api"
import "./EntityPage.css"

interface Client {
  id: number
  clientType: string
  phoneNumber: string
  identityNumber: string
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    clientType: "",
    phoneNumber: "",
    identityNumber: "",
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await clientApi.getAll()
      setClients(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching clients:", err)
      setError("Failed to fetch clients. Please try again later.")
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentClient) {
        await clientApi.update(currentClient.id, formData)
      } else {
        await clientApi.create(formData)
      }
      fetchClients()
      resetForm()
    } catch (err) {
      console.error("Error saving client:", err)
      setError("Failed to save client. Please try again.")
    }
  }

  const handleEdit = (client: Client) => {
    setCurrentClient(client)
    setFormData({
      clientType: client.clientType,
      phoneNumber: client.phoneNumber,
      identityNumber: client.identityNumber,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientApi.delete(id)
        fetchClients()
      } catch (err) {
        console.error("Error deleting client:", err)
        setError("Failed to delete client. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setCurrentClient(null)
    setFormData({
      clientType: "",
      phoneNumber: "",
      identityNumber: "",
    })
    setShowForm(false)
  }

  const filteredClients = clients.filter(
    (client) =>
      client.clientType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phoneNumber.includes(searchTerm) ||
      client.identityNumber.includes(searchTerm),
  )

  return (
    <div className="entity-page">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <button className="btn btn-primary btn-add" onClick={() => setShowForm(!showForm)}>
          <Add className="btn-add-icon" />
          <span>Add Client</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentClient ? "Edit Client" : "Add New Client"}</h2>
              <button className="modal-close" onClick={resetForm} aria-label="Close">
                <Close />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="clientType" className="form-label">
                      Client Type
                    </label>
                    <select
                      id="clientType"
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Individual">Individual</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      pattern="[0-9]{10}"
                      title="Phone number must be 10 digits"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="identityNumber" className="form-label">
                      Identity Number (CNE/Passport)
                    </label>
                    <input
                      type="text"
                      id="identityNumber"
                      name="identityNumber"
                      value={formData.identityNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {currentClient ? "Update" : "Save"}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container card">
          {filteredClients.length === 0 ? (
            <div className="no-data">No clients found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client Type</th>
                  <th>Phone Number</th>
                  <th>Identity Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.clientType}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.identityNumber}</td>
                    <td className="actions-cell">
                      <button className="btn-icon" onClick={() => handleEdit(client)}>
                        <Edit />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(client.id)}>
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default Clients
