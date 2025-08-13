"use client"

import { JSX, useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Settings, People, ShoppingCart, AttachMoney, TwoWheeler } from "@mui/icons-material"
import axios from "axios"
import "./Dashboard.css"

interface StatCard {
  title: string
  value: number
  icon: JSX.Element
  color: string
}

interface OrderSummary {
  totalPrice: number | string
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    motorcycles: 0,
    pieces: 0,
    clients: 0,
    orders: 0,
    revenue: 0,
  })

  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
    { name: "Jul", sales: 3490 },
  ]

  const inventoryData = [
    { name: "Motorcycles", value: 400 },
    { name: "Pieces", value: 300 },
  ]

  const expenseData = [
    { name: "CARBURANT", value: 2400 },
    { name: "COMMISSION", value: 1398 },
    { name: "DELIVERY", value: 9800 },
    { name: "PAPERS", value: 3908 },
    { name: "FIXING", value: 4800 },
    { name: "BILL", value: 3800 },
    { name: "OTHER", value: 4300 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

  useEffect(() => {
    const fetchData = async () => {
      try {

        const motorcyclesRes = await axios.get("http://localhost:8080/motorcycles")
        const piecesRes = await axios.get("http://localhost:8080/pieces")
        const clientsRes = await axios.get("http://localhost:8080/clients")
        const ordersRes = await axios.get("http://localhost:8080/orders")

        const orders: OrderSummary[] = ordersRes.data as OrderSummary[]
        const totalRevenue = orders.reduce((sum: number, order: OrderSummary) => sum + Number.parseFloat(String(order.totalPrice)), 0)

        setStats({
          motorcycles: motorcyclesRes.data.length,
          pieces: piecesRes.data.length,
          clients: clientsRes.data.length,
          orders: orders.length,
          revenue: totalRevenue,
        })

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setStats({
          motorcycles: 24,
          pieces: 156,
          clients: 48,
          orders: 32,
          revenue: 24500,
        })
      }
    }

    fetchData()
  }, [])

  const statCards: StatCard[] = [
    { title: "Motorcycles", value: stats.motorcycles, icon: <TwoWheeler />, color: "#3f51b5" },
    { title: "Pieces", value: stats.pieces, icon: <Settings />, color: "#f50057" },
    { title: "Clients", value: stats.clients, icon: <People />, color: "#00a854" },
    { title: "Orders", value: stats.orders, icon: <ShoppingCart />, color: "#fa8c16" },
    { title: "Revenue", value: stats.revenue, icon: <AttachMoney />, color: "#722ed1" },
  ]

  return (
    <div className="dashboard">
      <h1 className="page-title" >Dashboard</h1>

      <div className="stat-cards">
        {statCards.map((card, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-card-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-title">{card.title}</h3>
              <p className="stat-card-value">
                {card.title === "Revenue" ? `$${card.value.toLocaleString()}` : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <div className="card-header">
            <h2 className="card-title">Monthly Sales</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3f51b5" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="charts-row">
          <div className="card chart-card">
            <div className="card-header">
              <h2 className="card-title">Inventory Distribution</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-header">
              <h2 className="card-title">Expenses by Category</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8">
                    {expenseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
