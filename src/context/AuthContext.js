import { createContext, useReducer } from "react"
import { authReducer } from "./reducers/authReducer"

export const AuthContext = createContext()

function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(authReducer, {
    isLogin: false,
    user: {},
  })

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
