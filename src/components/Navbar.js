import { useState, useContext, useEffect } from "react"
import { useHistory, Link, StaticRouter } from "react-router-dom"
import { Nav, Navbar, Button } from "react-bootstrap"
import { AuthContext } from "../context/AuthContext"

import Logo from "../assets/logo.png"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import DropdownComponent from "./Dropdown"

export default function NavbarComponent({ shadow }) {
  const [state, dispatch] = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleShowLogin = () => setShowLogin(true)
  const handleShowRegister = () => setShowRegister(true)
  const closeLogin = () => setShowLogin(false)
  const closeRegister = () => setShowRegister(false)

  return (
    <>
      <Navbar
        className="nav-theme d-flex justify-content-between px-5"
        style={
          shadow
            ? {
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                backgroundColor: "#1F1F1F",
                position: "relative",
                marginBottom: "0px",
              }
            : {}
        }
      >
        <Navbar.Brand
          as={Link}
          to={state.user?.listAs === 1 ? "/admin" : "/"}
          className="nav-title "
        >
          <img
            alt=""
            src={Logo}
            width="30"
            className="d-inline-block align-top me-2"
          />
          <p className="d-inline light-color">
            <span className="red-color">DUMB</span>SOUND
          </p>
        </Navbar.Brand>
        <Nav className="ml-auto">
          {state.isLogin === true ? (
            <DropdownComponent />
          ) : (
            <>
              <Button onClick={handleShowLogin} className="navBtnLogin">
                Login
              </Button>
              <Button onClick={handleShowRegister} className="navBtnRegister">
                Register
              </Button>
            </>
          )}
        </Nav>
      </Navbar>

      <LoginModal
        closeLogin={closeLogin}
        showLogin={showLogin}
        handleShowRegister={handleShowRegister}
      />
      <RegisterModal
        showRegister={showRegister}
        closeRegister={closeRegister}
      />
    </>
  )
}
