import axios from "axios"

export const instanceAuth = axios.create({
  // baseURL: `https://multishopappmobile-production.up.railway.app`,
  baseURL: `https://multishop-appclient.onrender.com`,
  // baseURL: 'http://192.168.1.105:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  // baseURL: `https://products-production-9262.up.railway.app`,
  baseURL: 'https://multishop-appclient-products.onrender.com',
  // baseURL: 'http://192.168.1.105:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceSincro = axios.create({
  // baseURL: `https://orders-production-c033.up.railway.app`,
  baseURL: 'https://multishop-appclient-orders.onrender.com',
  // baseURL: 'http://192.168.1.105:6000',
  headers: {
    Accept: "application/json"
  }
})
