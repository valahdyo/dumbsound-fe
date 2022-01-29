import { Redirect, Route } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function AdminRoute(props) {
  const { component: Component, ...rest } = props
  const [state] = useContext(AuthContext)
  const isLogin = localStorage.getItem("isLogin")
  const isAdmin = localStorage.getItem("listAs")

  return (
    <Route
      {...rest}
      render={(prop) => {
        if (isLogin === "true" && isAdmin === "true") {
          return <Component {...prop} />
        } else {
          return <Redirect to="/" />
        }
      }}
    />
  )
}
