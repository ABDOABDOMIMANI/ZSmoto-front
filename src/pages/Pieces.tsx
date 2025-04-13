"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Add, Edit, Delete, Search } from "@mui/icons-material"
import { pieceApi } from "../services/api"
import "./EntityPage.css"

interface PieceMoto {
  id: number
  name: string
  description: string
  purchasePrice: number
  sellPrice: number
  quantity: number
  image: string
}

const Pieces = () => {
  const [pieces, setPieces] = useState<PieceMoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPiece, setCurrentPiece] = useState<PieceMoto | null>(null)
  const [formData, setFormData] = useState<Omit<PieceMoto, "id">>({
    name: "",
    description: "",
    purchasePrice: 0,
    sellPrice: 0,
    quantity: 0,
    image: "",
  })

  useEffect(() => {
    fetchPieces()
  }, [])

  const fetchPieces = async () => {
    try {
      setLoading(true)
      const response = await pieceApi.getAll()
      setPieces(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching pieces:", err)
      setError("Failed to fetch pieces. Please try again later.")
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentPiece) {
        await pieceApi.update(currentPiece.id, formData)
      } else {
        await pieceApi.create(formData)
      }
      fetchPieces()
      resetForm()
    } catch (err) {
      console.error("Error saving piece:", err)
      setError("Failed to save piece. Please try again.")
    }
  }

  const handleEdit = (piece: PieceMoto) => {
    setCurrentPiece(piece)
    setFormData({
      name: piece.name,
      description: piece.description,
      purchasePrice: piece.purchasePrice,
      sellPrice: piece.sellPrice,
      quantity: piece.quantity,
      image: piece.image,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this piece?")) {
      try {
        await pieceApi.delete(id)
        fetchPieces()
      } catch (err) {
        console.error("Error deleting piece:", err)
        setError("Failed to delete piece. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setCurrentPiece(null)
    setFormData({
      name: "",
      description: "",
      purchasePrice: 0,
      sellPrice: 0,
      quantity: 0,
      image: "",
    })
    setShowForm(false)
  }

  const filteredPieces = pieces.filter(
    (piece) =>
      piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="entity-page">
      <div className="page-header">
        <h1 className="page-title">Motorcycle Parts</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Add /> Add Part
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search parts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="form-container card">
          <h2>{currentPiece ? "Edit Part" : "Add New Part"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchasePrice" className="form-label">
                  Purchase Price
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sellPrice" className="form-label">
                  Sell Price
                </label>
                <input
                  type="number"
                  id="sellPrice"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {currentPiece ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container card">
          {filteredPieces.length === 0 ? (
            <div className="no-data">No parts found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Purchase Price</th>
                  <th>Sell Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPieces.map((piece) => (
                  <tr key={piece.id}>
                    <td>
                      {piece.image ? (
                        <img src={piece.image || "/placeholder.svg"} alt={piece.name} className="table-image" />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{piece.name}</td>
                    <td>{piece.description}</td>
                    <td>${piece.purchasePrice.toFixed(2)}</td>
                    <td>${piece.sellPrice.toFixed(2)}</td>
                    <td>{piece.quantity}</td>
                    <td className="actions-cell">
                      <button className="btn-icon" onClick={() => handleEdit(piece)}>
                        <Edit />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(piece.id)}>
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

export default Pieces
