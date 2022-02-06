import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { API } from "../config/api"
import { useHistory } from "react-router-dom"

import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap"

export default function RegisterModal({ showRegister, closeRegister }) {
  let history = useHistory()
  const [state, dispatch] = useContext(AuthContext)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    gender: "",
    phone: "",
    address: "",
  })
  const { email, password, fullName, gender, phone, address } = form

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const body = JSON.stringify(form)
      const response = await API.post("/auth/register", body, config)

      if (response?.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        })
        history.push("/")
        closeRegister()
      }
    } catch (error) {
      if (error.response.status === 409) {
        const alert = (
          <Alert variant="danger" className="py-1">
            Email already exist!
          </Alert>
        )
        setMessage(alert)
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Register Failed, {error.response.data.error.message}
          </Alert>
        )
        setMessage(alert)
      }
    }
  }

  return (
    <>
      <Modal
        show={showRegister}
        onHide={closeRegister}
        contentClassName="w-75 m-auto"
      >
        <Modal.Body className="bg-color">
          <Row className="d-flex justify-content-center">
            <Col lg="11" className="light-color">
              <div className="profile-heading text-left mt-3 mb-4 h3">
                Register
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
                    type="email"
                    placeholder="Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
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
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Control
                    className="form-color"
                    onChange={handleOnChange}
                    value={fullName}
                    name="fullName"
                    size="sm"
                    type="text"
                    placeholder="Full Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGender">
                  <Form.Select
                    aria-label="Default select example"
                    size="sm"
                    name="gender"
                    onChange={handleOnChange}
                    required
                  >
                    <option
                      style={{ color: "gray" }}
                      value=""
                      disabled
                      selected
                    >
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Control
                    className="form-color"
                    onChange={handleOnChange}
                    value={phone}
                    name="phone"
                    size="sm"
                    type="number"
                    placeholder="Phone"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formAddress">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    className="form-color"
                    onChange={handleOnChange}
                    value={address}
                    name="address"
                    size="sm"
                    type="text"
                    placeholder="Address"
                  />
                </Form.Group>

                <Button
                  onClick={handleSubmit}
                  className="mb-3 red-btn"
                  style={{ width: "100%" }}
                >
                  Register
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}
