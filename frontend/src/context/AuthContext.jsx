"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]))
        setUser(payload)
      } catch (err) {
        console.error("[v0] Invalid token")
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, newToken) => {
    setUser(userData)
    setToken(newToken)
    localStorage.setItem("token", newToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
