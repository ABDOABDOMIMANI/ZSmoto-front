"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Add, Edit, Delete, Search, Close } from "@mui/icons-material"
import { motorcycleApi } from "../services/api"
import "./EntityPage.css"

interface Motorcycle {
  id :number,
  numChassis: string
  model: string
  brand: string
  cylinderSize: number
  isNew: boolean
  mileageKm: number
  purchasePrice: number
  sellPrice: number
  quantity: number
  image: string
}

const Motorcycles = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentMotorcycle, setCurrentMotorcycle] = useState<Motorcycle | null>(null)
  const [formData, setFormData] = useState<Omit<Motorcycle, "id">>({
    
    numChassis: "",
    model: "",
    brand: "",
    cylinderSize: 0,
    isNew: true,
    mileageKm: 0,
    purchasePrice: 0,
    sellPrice: 0,
    quantity: 0,
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMotorcycles()
  }, [])

  const fetchMotorcycles = async () => {
    try {
      setLoading(true)
      const response = await motorcycleApi.getAll()
      setMotorcycles(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching motorcycles:", err)
      setError("Failed to fetch motorcycles. Please try again later.")
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number.parseFloat(value)
            : value,
    })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentMotorcycle) {
        // Use multipart only if a new image is selected; otherwise JSON
        if (imageFile) {
          const multipart = new FormData()
          multipart.append("numChassis", String(formData.numChassis))
          multipart.append("model", String(formData.model))
          multipart.append("brand", String(formData.brand))
          multipart.append("cylinderSize", String(formData.cylinderSize))
          multipart.append("isNew", String(formData.isNew))
          multipart.append("mileageKm", String(formData.mileageKm))
          multipart.append("purchasePrice", String(formData.purchasePrice))
          multipart.append("sellPrice", String(formData.sellPrice))
          multipart.append("quantity", String(formData.quantity))
          multipart.append("image", imageFile)
          await motorcycleApi.update(currentMotorcycle.id, multipart)
        } else {
          await motorcycleApi.update(currentMotorcycle.id, formData)
        }
      } else {
        // Build multipart form data to match backend @RequestParam and image file
        const multipart = new FormData()
        multipart.append("numChassis", String(formData.numChassis))
        multipart.append("model", String(formData.model))
        multipart.append("brand", String(formData.brand))
        multipart.append("cylinderSize", String(formData.cylinderSize))
        multipart.append("isNew", String(formData.isNew))
        multipart.append("mileageKm", String(formData.mileageKm))
        multipart.append("purchasePrice", String(formData.purchasePrice))
        multipart.append("sellPrice", String(formData.sellPrice))
        multipart.append("quantity", String(formData.quantity))
        if (imageFile) {
          multipart.append("image", imageFile)
        }
        await motorcycleApi.create(multipart)
      }
      fetchMotorcycles()
      resetForm()
    } catch (err) {
      console.error("Error saving motorcycle:", err)
      setError("Failed to save motorcycle. Please try again.")
    }
  }

  const handleEdit = (motorcycle: Motorcycle) => {
    setCurrentMotorcycle(motorcycle)
    setFormData(motorcycle)
    const existing = motorcycle.image || ""
    const prefixed = existing
      ? (existing.startsWith("data:") ? existing : `data:image/*;base64,${existing}`)
      : ""
    setImagePreview(prefixed)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this motorcycle?")) {
      try {
        await motorcycleApi.delete(id)
        fetchMotorcycles()
      } catch (err) {
        console.error("Error deleting motorcycle:", err)
        setError("Failed to delete motorcycle. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setCurrentMotorcycle(null)
    setFormData({
      
      numChassis: "",
      model: "",
      brand: "",
      cylinderSize: 0,
      isNew: true,
      mileageKm: 0,
      purchasePrice: 0,
      sellPrice: 0,
      quantity: 0,
      image: "",
    })
    setImagePreview("")
    setImageFile(null)
    setShowForm(false)
  }

  const filteredMotorcycles = motorcycles.filter(
    (motorcycle) =>
      (motorcycle.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (motorcycle.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (motorcycle.numChassis?.toLowerCase() || '').includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="entity-page">
      <div className="page-header">
        <h1 className="page-title">Motorcycles</h1>
        <button className="btn btn-primary btn-add" onClick={() => setShowForm(!showForm)}>
          <Add className="btn-add-icon" />
          <span>Add Motorcycle</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search motorcycles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentMotorcycle ? "Edit Motorcycle" : "Add New Motorcycle"}</h2>
              <button className="modal-close" onClick={resetForm} aria-label="Close">
                <Close />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="numChassis" className="form-label">Chassis Number</label>
                    <input
                      type="text"
                      id="numChassis"
                      name="numChassis"
                      value={formData.numChassis}
                      onChange={handleInputChange}
                      className="form-input"
                      required={!currentMotorcycle}
                      disabled={!!currentMotorcycle}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="model" className="form-label">Model</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand" className="form-label">Brand</label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cylinderSize" className="form-label">Cylinder Size</label>
                    <input
                      type="number"
                      id="cylinderSize"
                      name="cylinderSize"
                      value={formData.cylinderSize}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label htmlFor="isNew" className="form-label">New</label>
                    <input
                      type="checkbox"
                      id="isNew"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mileageKm" className="form-label">Mileage (1000 km)</label>
                    <input
                      type="number"
                      id="mileageKm"
                      name="mileageKm"
                      value={formData.mileageKm}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="purchasePrice" className="form-label">Purchase Price</label>
                    <input
                      type="number"
                      id="purchasePrice"
                      name="purchasePrice"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sellPrice" className="form-label">Sell Price</label>
                    <input
                      type="number"
                      id="sellPrice"
                      name="sellPrice"
                      value={formData.sellPrice}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group image-upload-group">
                    <label className="form-label">Image</label>
                    <div
                      className="upload-area"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {(imagePreview || formData.image) ? (
                        <div className="image-preview">
                          <img
                            src={
                              imagePreview
                                || (formData.image
                                  ? (formData.image.startsWith("data:")
                                      ? formData.image
                                      : `data:image/*;base64,${formData.image}`)
                                  : "")
                            }
                            alt="Preview"
                          />
                        </div>
                      ) : (
                        <>
                          <p>Drag & drop an image here, or</p>
                          <label htmlFor="fileInput" className="btn btn-outline upload-button">Choose file</label>
                        </>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputChange}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {currentMotorcycle ? "Update" : "Save"}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
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
          {filteredMotorcycles.length === 0 ? (
            <div className="no-data">No motorcycles found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Chassis Number</th>
                  <th>Model</th>
                  <th>Brand</th>
                  <th>Cylinder Size</th>
                  <th>Status</th>
                  <th>Mileage</th>
                  <th>Purchase Price</th>
                  <th>Sell Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMotorcycles.map((motorcycle) => (
                  <tr key={motorcycle.numChassis}>
                    <td>
                      {motorcycle.image ? (
                        <img
                          src={motorcycle.image.startsWith("data:") ? motorcycle.image : `data:image/*;base64,${motorcycle.image}`}
                          alt={motorcycle.model}
                          className="table-image"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{motorcycle.numChassis}</td>
                    <td>{motorcycle.model}</td>
                    <td>{motorcycle.brand}</td>
                    <td>{motorcycle.cylinderSize} cc</td>
                    <td>
                      <span className={`badge ${motorcycle.isNew ? "badge-success" : "badge-warning"}`}>
                        {motorcycle.isNew ? "New" : "Used"}
                      </span>
                    </td>
                    <td>{motorcycle.mileageKm} km</td>
                    <td>${motorcycle.purchasePrice ? motorcycle.purchasePrice.toFixed(2) : '0.00'}</td>
                    <td>${motorcycle.sellPrice ? motorcycle.sellPrice.toFixed(2) : '0.00'}</td>
                    <td>{motorcycle.quantity}</td>
                    <td className="actions-cell d-flex justify-content-center mt-2">
                      <button className="btn-icon" onClick={() => handleEdit(motorcycle)}><Edit /></button>
                      <button className="btn-icon delete" onClick={() => handleDelete(motorcycle.id)}><Delete /></button>
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

export default Motorcycles
