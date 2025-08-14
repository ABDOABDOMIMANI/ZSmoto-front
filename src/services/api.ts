import axios from "axios"

// Use build-time injected API URL or fallbacks (supports both Vite and CRA-style vars)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const injectedApiUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : undefined
const viteApiUrl = (import.meta as { env: Record<string, string | undefined> })?.env?.VITE_API_URL
const craApiUrl = (import.meta as { env: Record<string, string | undefined> })?.env?.REACT_APP_API_URL
export const REACT_APP_API_URL: string = (injectedApiUrl || craApiUrl || viteApiUrl ) as string

// Create axios instance with base URL
const api = axios.create({
  baseURL: REACT_APP_API_URL,
})

// --- Types ---

export interface Motorcycle {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

export interface Piece {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

export interface Client {
  id: number
  clientType: string
  phoneNumber: string
  identityNumber: string
}

export interface Order {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

export interface Worker {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

export interface Deadline {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

export interface Expense {
  id: number
  // Add more fields as needed
  [key: string]: unknown
}

// --- API ---

// Motorcycle API
export const motorcycleApi = {
  getAll: () => api.get<Motorcycle[]>("/motorcycles"),
  getById: (id: string) => api.get<Motorcycle>(`/motorcycles/${id}`),
  create: (data: Omit<Motorcycle, "id"> | FormData) => {
    if (data instanceof FormData) {
      return api.post("/motorcycles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    }
    return api.post("/motorcycles", data)
  },
  update: (id: number, data: Partial<Motorcycle> | FormData) => {
    if (data instanceof FormData) {
      return api.put(`/motorcycles/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    }
    return api.put(`/motorcycles/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    })
  },
  delete: (id: number) => api.delete(`/motorcycles/${id}`),
}

// Piece API
export const pieceApi = {
  getAll: () => api.get<Piece[]>("/pieces"),
  getById: (id: number) => api.get<Piece>(`/pieces/${id}`),
  create: (data: Omit<Piece, "id"> | FormData) => {
    if (data instanceof FormData) {
      return api.post("/pieces", data, { headers: { "Content-Type": "multipart/form-data" } })
    }
    return api.post("/pieces", data)
  },
  update: (id: number, data: Partial<Piece> | FormData) => {
    if (data instanceof FormData) {
      return api.put(`/pieces/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
    }
    return api.put(`/pieces/${id}`, data)
  },
  delete: (id: number) => api.delete(`/pieces/${id}`),
}

// Client API
export const clientApi = {
  getAll: () => api.get<Client[]>("/clients"),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (data: Omit<Client, "id">) => api.post("/clients", data),
  update: (id: number, data: Partial<Client>) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
}

// Order API
export const orderApi = {
  getAll: () => api.get<Order[]>("/orders"),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: Omit<Order, "id">) => api.post("/orders", data),
  update: (id: number, data: Partial<Order>) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
}

// Worker API
export const workerApi = {
  getAll: () => api.get<Worker[]>("/workers"),
  getById: (id: number) => api.get<Worker>(`/workers/${id}`),
  create: (data: Omit<Worker, "id">) => api.post("/workers", data),
  update: (id: number, data: Partial<Worker>) => api.put(`/workers/${id}`, data),
  delete: (id: number) => api.delete(`/workers/${id}`),
}

// Deadline API
export const deadlineApi = {
  getAll: () => api.get<Deadline[]>("/deadlines"),
  getById: (id: number) => api.get<Deadline>(`/deadlines/${id}`),
  create: (data: Omit<Deadline, "id">) => api.post("/deadlines", data),
  update: (id: number, data: Partial<Deadline>) => api.put(`/deadlines/${id}`, data),
  delete: (id: number) => api.delete(`/deadlines/${id}`),
}

// Expense API
export const expenseApi = {
  getAll: () => api.get<Expense[]>("/expenses"),
  getById: (id: number) => api.get<Expense>(`/expenses/${id}`),
  create: (data: Omit<Expense, "id">) => api.post("/expenses", data),
  update: (id: number, data: Partial<Expense>) => api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
}

export default api
