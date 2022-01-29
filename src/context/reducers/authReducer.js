export const authReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case "AUTH_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("accessToken", payload.accessToken)
      localStorage.setItem("isLogin", "true")
      if (payload.data.user?.listAs === 1)
        localStorage.setItem("listAs", "true")
      else localStorage.setItem("listAs", "false")
      return {
        isLogin: true,
        user: payload.data.user,
      }
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("accessToken")
      localStorage.removeItem("isLogin")
      localStorage.removeItem("listAs")
      return {
        isLogin: false,
        user: {},
      }

    default:
      return state
  }
}
