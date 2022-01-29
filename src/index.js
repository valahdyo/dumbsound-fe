import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import AuthContextProvider from "./context/AuthContext"
import { QueryClient, QueryClientProvider } from "react-query"

const client = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
