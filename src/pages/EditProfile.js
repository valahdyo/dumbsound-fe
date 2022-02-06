import { useState, useRef } from "react"
import { useHistory } from "react-router-dom"
import { API } from "../config/api"
import { useQuery, useMutation } from "react-query"
import ReactLoading from "react-loading"
import ProfilePhoto from "../assets/profile-photo.png"
import NoData from "../assets/noData-2.svg"

import NavbarComponent from "../components/Navbar"
import { Button, Container, Row, Col, Alert, Form } from "react-bootstrap"

export default function EditProfile() {
  let history = useHistory()
  const [preview, setPreview] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [message, setMessage] = useState(null)
  const inputRef = useRef(null)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    profileImage: "",
  })
  /**
   * Request data from backend for user data
   */
  let { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user/profile")
    return response.data.data
  })

  /**
   * Handle change value form input
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    })
    if (e.target.type === "file") {
      if (inputRef.current?.files) {
        setUploadedFileName(inputRef.current.files[0].name)
        let url = URL.createObjectURL(e.target.files[0])
        setPreview(url)
      }
    }
  }

  const handleUploadImage = () => {
    inputRef.current?.click()
  }

  const resetFile = () => {
    setUploadedFileName(null)
    inputRef.current.file = null
    form.profileImage = ""
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData()
      if (form.profileImage[0]) {
        formData.set(
          "profileImage",
          form?.profileImage[0],
          form.profileImage[0]?.name
        )
      }
      form.fullName.length !== 0 && formData.set("fullName", form?.fullName)
      form.email.length !== 0 && formData.set("email", form?.email)
      form.phone.length !== 0 && formData.set("phone", form?.phone)
      form.address.length !== 0 && formData.set("address", form?.address)

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const response = await API.patch("/user/edit-profile", formData, config)
      history.push("/user/profile")
    } catch (error) {
      console.log(error)
      const alert = (
        <Alert variant="danger" className="py-1">
          {error.message}
        </Alert>
      )
      setMessage(alert)
    }
  })

  if (profile?.userPayment.length > 0) {
    var expired = null

    profile?.userPayment.map((item) => {
      if (item.dueDate) {
        expired = new Date(item.dueDate).toDateString()
      }
    })
  }

  return (
    <>
      <NavbarComponent />
      <Container fluid className="profile-wrapper">
        <Row>
          <Col lg={6}>
            <h1 className="profile-heading light-color">My Profile</h1>
            <Row>
              <Col>
                <img
                  style={{ width: "inherit", height: "auto" }}
                  src={
                    profile?.profileImage ? profile?.profileImage : ProfilePhoto
                  }
                  alt="profile"
                />
              </Col>
              <Col>
                <div className="profile-detail-wrapper">
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Full Name</p>
                    <p className="profile-detail-content">
                      {profile?.fullName}
                    </p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Email</p>
                    <p className="profile-detail-content">{profile?.email}</p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Address</p>
                    <p className="profile-detail-content">{profile?.address}</p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Phone</p>
                    <p className="profile-detail-content">{profile?.phone}</p>
                  </div>
                  <div className="profile-detail-info">
                    <p className="profile-detail-heading">Status</p>
                    <p className="profile-detail-content">
                      {profile?.subscribe === 1
                        ? `Active until, ${expired}.`
                        : "Not Active"}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <h1 className="profile-heading light-color">Edit Detail</h1>
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <div className="mb-3">
                <Button
                  onClick={handleUploadImage}
                  className="orange-btn"
                  style={{ width: "30%", fontSize: "14px" }}
                >
                  Upload Photo
                </Button>
                <input
                  ref={inputRef}
                  onChange={handleChange}
                  name="profileImage"
                  className="d-none"
                  type="file"
                />
                {uploadedFileName && (
                  <>
                    <button
                      onClick={resetFile}
                      type="button"
                      class="btn-close btn-close-white float-none ms-4"
                      aria-label=""
                    ></button>
                    <span className="light-color ml-2">{uploadedFileName}</span>
                    <div>
                      <img
                        src={preview}
                        className="prev-img mt-3"
                        alt="preview"
                      />
                    </div>
                  </>
                )}
              </div>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.name}
                  name="fullName"
                  size="sm"
                  type="text"
                  placeholder={profile?.fullName}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.email}
                  name="email"
                  size="sm"
                  type="text"
                  placeholder={profile?.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formNumber">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={form.phone}
                  name="phone"
                  size="sm"
                  type="text"
                  placeholder={profile?.phone}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Control
                  as="textarea"
                  className="form-color"
                  onChange={handleChange}
                  value={form.phone}
                  name="address"
                  size="sm"
                  type="text"
                  placeholder={profile?.address}
                />
              </Form.Group>

              <Button
                onClick={(e) => handleSubmit.mutate(e)}
                className="mt-3 red-btn w-100 d-flex justify-content-center"
                type="submit"
                size="sm"
              >
                <div className="me-3">Update Detail</div>
                {handleSubmit.isLoading && (
                  <ReactLoading type="spin" height="3%" width="3%" />
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}
