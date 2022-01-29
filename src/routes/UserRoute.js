import { Redirect, Route } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function UserRoute(props) {
  const { component: Component, ...rest } = props
  const [state] = useContext(AuthContext)
  const isLogin = localStorage.getItem("isLogin")
  const isUser = localStorage.getItem("listAs")

  return (
    <Route
      {...rest}
      render={(prop) => {
        if (isLogin === "true" && isUser === "false") {
          return <Component {...prop} />
        } else {
          return <Redirect to="/admin" />
        }
      }}
    />
  )
}
