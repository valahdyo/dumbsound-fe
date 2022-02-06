import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { API } from "../config/api"

export default function LoginModal({
  showLogin,
  closeLogin,
  handleShowRegister,
}) {
  const history = useHistory()
  const [state, dispatch] = useContext(AuthContext)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const { email, password } = form

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      // Configuration
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      // Data body
      const body = JSON.stringify(form)
      console.log(body)
      // Insert data for login process
      const response = await API.post("/auth/login", body, config)
      // Checking process
      if (response?.status === 200) {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        })

        const alert = (
          <Alert variant="success" className="py-1">
            Login Success
          </Alert>
        )
        setMessage(alert)
        setForm({
          email: "",
          password: "",
        })

        if (response?.data.data.user.listAs === 1) history.push("/admin")
        else history.push("/")
        closeLogin()
      }
      setMessage(null)
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login Failed
        </Alert>
      )
      setMessage(alert)
      console.log(error)
    }
  }
  //admin
  const handleDemoAdmin = (e) => {
    setForm({ email: "admin@mail.com", password: "123456" })
    handleSubmit(e)
  }

  const handleDemoCustomer = (e) => {
    setForm({ email: "najwa@mail.com", password: "123456" })
    handleSubmit(e)
  }

  const handleClickHere = () => {
    closeLogin()
    handleShowRegister()
  }

  return (
    <>
      <Modal
        show={showLogin}
        onHide={closeLogin}
        contentClassName="w-75 m-auto"
      >
        <Modal.Body className="bg-color">
          <Row className="d-flex justify-content-center">
            <Col lg="11" className="light-color">
              <div className="profile-heading text-left mt-3 mb-4 h3">
                Login
              </div>
              {true && message}
              <Form /*onSubmit={handleOnSubmit}*/>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    className="form-color"
                    onChange={handleOnChange}
                    value={email}
                    name="email"
                    size="sm"
                    type="text"
                    placeholder="Email"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Control
                    className="form-color"
                    onChange={handleOnChange}
                    value={password}
                    name="password"
                    size="sm"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <Button
                  onClick={handleSubmit}
                  className="red-btn mb-3"
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
                <p className="gray-color ff-avenir fw-400 text-center">
                  Don't have an account ? Klik{" "}
                  <strong>
                    <a href="#" id="a-register" onClick={handleClickHere}>
                      Here
                    </a>
                  </strong>
                </p>
                <Button
                  onClick={handleDemoCustomer}
                  className="red-btn mb-3"
                  style={{ width: "100%" }}
                >
                  Demo Customer
                </Button>
                <Button
                  onClick={handleDemoAdmin}
                  className="red-btn mb-3"
                  style={{ width: "100%" }}
                >
                  Demo Admin
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}
