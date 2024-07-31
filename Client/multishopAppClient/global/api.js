import axios from "axios"

export const instanceAuth = axios.create({
  // baseURL: `https://multishopappmobile-production.up.railway.app`,
  // baseURL: `https://multishop-app-mobile-auth.onrender.com`,
  baseURL: 'http://192.168.1.104:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  // baseURL: `https://products-production-9262.up.railway.app`,
  // baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  baseURL: 'http://192.168.1.104:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceSincro = axios.create({
  // baseURL: `https://orders-production-c033.up.railway.app`,
  // baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  baseURL: 'http://192.168.1.104:6000',
  headers: {
    Accept: "application/json"
  }
})
