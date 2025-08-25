"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Add, Edit, Delete, Search, Close } from "@mui/icons-material"
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
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPieces()
  }, [])

  const fetchPieces = async () => {
    try {
      setLoading(true)
      const response = await pieceApi.getAll()
      setPieces(response.data as unknown as PieceMoto[])
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
        if (imageFile) {
          const multipart = new FormData()
          multipart.append("name", formData.name)
          multipart.append("description", formData.description)
          multipart.append("purchasePrice", String(formData.purchasePrice))
          multipart.append("sellPrice", String(formData.sellPrice))
          multipart.append("quantity", String(formData.quantity))
          multipart.append("image", imageFile)
          await pieceApi.update(currentPiece.id, multipart)
        } else {
          await pieceApi.update(currentPiece.id, formData)
        }
      } else {
        const multipart = new FormData()
        multipart.append("name", formData.name)
        multipart.append("description", formData.description)
        multipart.append("purchasePrice", String(formData.purchasePrice))
        multipart.append("sellPrice", String(formData.sellPrice))
        multipart.append("quantity", String(formData.quantity))
        if (imageFile) multipart.append("image", imageFile)
        await pieceApi.create(multipart)
      }
      fetchPieces()
      resetForm()
    } catch (err) {
      console.error("Error saving piece:", err)
      setError("Failed to save piece. Please try again.")
    }
  }

  const handleImageFile = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : ""
      setFormData({ ...formData, image: dataUrl })
      setImagePreview(dataUrl)
    }
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    handleImageFile(file)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
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
    const existing = piece.image || ""
    const prefixed = existing ? (existing.startsWith("data:") ? existing : `data:image/*;base64,${existing}`) : ""
    setImagePreview(prefixed)
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
    setImagePreview("")
    setImageFile(null)
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
        <button className="btn btn-primary btn-add" onClick={() => setShowForm(!showForm)}>
          <Add className="btn-add-icon" />
          <span>Add Part</span>
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
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentPiece ? "Edit Part" : "Add New Part"}</h2>
              <button className="modal-close" onClick={resetForm} aria-label="Close">
                <Close />
              </button>
            </div>
            <div className="modal-body">
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

                  <div className="form-group image-upload-group">
                    <label htmlFor="image" className="form-label">
                      Image
                    </label>
                    <div
                      className="upload-area"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview || formData.image ? (
                        <div className="image-preview">
                          <img
                            src={
                              imagePreview || (formData.image ? (formData.image.startsWith("data:") ? formData.image : `data:image/*;base64,${formData.image}`) : "")
                            }
                            alt="Preview"
                          />
                        </div>
                      ) : (
                        <>
                          <p>Drag & drop an image here, or</p>
                          <label htmlFor="fileInputPiece" className="btn btn-outline upload-button">Choose file</label>
                        </>
                      )}
                      <input
                        id="fileInputPiece"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputChange}
                        style={{ display: "none" }}
                      />
                    </div>
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
          </div>
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
                        <img
                          src={piece.image.startsWith("data:") ? piece.image : `data:image/*;base64,${piece.image}`}
                          alt={piece.name}
                          className="table-image"
                        />
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
