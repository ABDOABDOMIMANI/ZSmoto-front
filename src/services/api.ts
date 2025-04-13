import axios from "axios"

const API_URL = "http://localhost:8080"

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Motorcycle API
export const motorcycleApi = {
  getAll: () => api.get("/motorcycles"),
  getById: (id: string) => api.get(`/motorcycles/${id}`),
  create: (data: any) => api.post("/motorcycles", data),
  update: (id: number, data: any) => api.put(`/motorcycles/${id}`, data),
  delete: (id: number) => api.delete(`/motorcycles/${id}`),
}

// Piece API
export const pieceApi = {
  getAll: () => api.get("/pieces"),
  getById: (id: number) => api.get(`/pieces/${id}`),
  create: (data: any) => api.post("/pieces", data),
  update: (id: number, data: any) => api.put(`/pieces/${id}`, data),
  delete: (id: number) => api.delete(`/pieces/${id}`),
}

// Client API
export const clientApi = {
  getAll: () => api.get("/clients"),
  getById: (id: number) => api.get(`/clients/${id}`),
  create: (data: any) => api.post("/clients", data),
  update: (id: number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
}

// Order API
export const orderApi = {
  getAll: () => api.get("/orders"),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post("/orders", data),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
}

// Worker API
export const workerApi = {
  getAll: () => api.get("/workers"),
  getById: (id: number) => api.get(`/workers/${id}`),
  create: (data: any) => api.post("/workers", data),
  update: (id: number, data: any) => api.put(`/workers/${id}`, data),
  delete: (id: number) => api.delete(`/workers/${id}`),
}

// Deadline API
export const deadlineApi = {
  getAll: () => api.get("/deadlines"),
  getById: (id: number) => api.get(`/deadlines/${id}`),
  create: (data: any) => api.post("/deadlines", data),
  update: (id: number, data: any) => api.put(`/deadlines/${id}`, data),
  delete: (id: number) => api.delete(`/deadlines/${id}`),
}

// Expense API
export const expenseApi = {
  getAll: () => api.get("/expenses"),
  getById: (id: number) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post("/expenses", data),
  update: (id: number, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
}

export default api
