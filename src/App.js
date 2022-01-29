import { BrowserRouter as Router } from "react-router-dom"
import Routes from "./routes"
import { useEffect, useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { API, setAuthToken } from "./config/api"

import "bootstrap/dist/css/bootstrap.min.css"
import "react-jinke-music-player/assets/index.css"
import "./styles/index.css"

/**
 * Set access token if exist in localStorage
 */
if (localStorage.accessToken) {
  setAuthToken(localStorage.accessToken)
}

function App() {
  const [state, dispatch] = useContext(AuthContext)

  /**
   * Checking permission of logged in user and set to global state
   * if its not logged in local storage will be cleared
   */
  const checkUser = async () => {
    try {
      if (localStorage.accessToken) {
        setAuthToken(localStorage.accessToken)
      }

      const response = await API.get("/auth/check-auth")

      let payload = response.data
      payload.accessToken = localStorage.accessToken

      dispatch({
        type: "AUTH_SUCCESS",
        payload: payload,
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: "AUTH_ERROR",
      })
    }
  }

  /**
   * Run check user every change on login and logout state
   */
  useEffect(() => {
    checkUser()
  }, [state.isLogin])
  return (
    <Router>
      <Routes />
    </Router>
  )
}

export default App
