import { Form, Row, Col, Button, Container, Alert } from "react-bootstrap"
import { useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { API } from "../config/api"
import { useHistory } from "react-router-dom"
export default function AddArtist() {
  let history = useHistory()

  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    name: "",
    old: "",
    type: "",
    startCarerr: "",
  })
  const { name, old, type, startCarerr } = form

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
      const response = await API.post("/artist/add", body, config)

      if (response?.status === 200) {
        const alert = (
          <Alert variant="success" className="py-1">
            Add Success
          </Alert>
        )
        setForm({
          name: "",
          old: "",
          type: "",
          startCarerr: "",
        })
        setMessage(alert)
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Add Failed
        </Alert>
      )
      setMessage(alert)
      console.log(error)
    }
  }
  return (
    <>
      <Container>
        <div className="profile-heading text-left h3 mt-5 mb-4 text-white ff-avenir fw-800">
          Add Artist
        </div>
        <Row className="d-flex justify-content-left">
          <Col lg="11">
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <Form.Group className="mb-3" controlId="formNameId">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={name}
                  name="name"
                  size="sm"
                  type="text"
                  placeholder="Name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicOld">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={old}
                  name="old"
                  size="sm"
                  type="number"
                  placeholder="Old"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicSolo">
                <Form.Select
                  className="form-color"
                  size="sm"
                  aria-label="Default select example"
                  name="type"
                  onChange={handleOnChange}
                  required
                >
                  <option value="" disabled selected>
                    Type
                  </option>
                  <option value="Solo">Solo</option>
                  <option value="Band">Band</option>
                  <option value="Group">Group</option>
                  <option value="Others">Others</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCarrer">
                <Form.Control
                  className="form-color"
                  onChange={handleOnChange}
                  value={startCarerr}
                  name="startCarerr"
                  size="sm"
                  type="number"
                  placeholder="Start a Carrer"
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  onClick={handleSubmit}
                  // style={{ marginLeft: "75%" }}
                  className="orange-btn w-25 text-center "
                  type="submit"
                  size="sm"
                >
                  Add Artist
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}
