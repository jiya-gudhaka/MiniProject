import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_BASE,
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[v0] API Error:", error.response?.status, error.message)
    return Promise.reject(error)
  },
)

export default apiClient
