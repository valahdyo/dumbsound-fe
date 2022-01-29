import axios from "axios"

/**
 * Setting up axios
 */
export const API = axios.create({
  baseURL: process.env.REACT_APP_BASEURL || "http://localhost:5000/api/v1/",
})

// Set Authorization Token Header
export const setAuthToken = (token) => {
  if (token) {
    console.log("token provided ", token)
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    console.log("not token")
    delete API.defaults.headers.common["Authorization"]
  }
}
