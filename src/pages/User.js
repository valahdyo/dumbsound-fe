import { useRef, useState, useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import { API } from "../config/api"
import ReactLoading from "react-loading"
import { Col, Container, Form, Row, Alert, Button } from "react-bootstrap"
import NavbarComponent from "../components/Navbar"
import { useHistory } from "react-router-dom"
import UploadIcon from "../assets/upload-icon.png"
import Paid from "../assets/undraw_well_done_i2wr.svg"
import Cancel from "../assets/undraw_cancel_re_ctke.svg"
import Pending from "../assets/undraw_pending_approval_xuu9.svg"

export default function User() {
  let history = useHistory()
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    attache: "",
  })

  let { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user/profile")

    return response.data.data
  })

  if (profile?.userPayment.length > 0) {
    var expired = null
    profile?.userPayment.map((item) => {
      if (item.dueDate) {
        expired = new Date(item.dueDate).toDateString()
      }
    })
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.files,
    })
    if (e.target.type === "file") {
      if (inputRef.current?.files) {
        setUploadedFileName(inputRef.current.files[0].name)
        let url = URL.createObjectURL(e.target.files[0])
        setPreview(url)
      }
    }
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const formData = new FormData()
      if (!form.attache[0]) {
        console.log("error")
        throw new Error("Please fill in all fields!")
      }
      formData.set("attache", form?.attache[0], form.attache[0]?.name)

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }

      const response = await API.post("/transaction/create", formData, config)

      history.push("/user")
    } catch (error) {
      console.log(error)
      const alert = (
        <Alert variant="danger" className="py-1">
          Please fill in all fields!
        </Alert>
      )
      setMessage(alert)
    }
  })

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js"
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-nBQolgt3n8su8Qlw"

    let scriptTag = document.createElement("script")
    scriptTag.src = midtransScriptUrl
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey)

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  const handlePay = useMutation(async (e) => {
    try {
      e.preventDefault()
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }
      const response = await API.get("/transaction/create-gateway", config)
      const token = response.data.payment.token

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */

          history.push("/user")
        },
        onPending: function (result) {
          /* You may add your own implementation here */

          history.push("/user")
        },
        onError: function (result) {
          /* You may add your own implementation here */
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment")
        },
      })
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <>
      <NavbarComponent />
      <Container className="center-div d-flex justify-content-center">
        <div style={{ marginTop: "10%" }}>
          {profile?.userPayment.length > 0 ? (
            profile?.userPayment[0].status === "Pending" ? (
              <>
                <img
                  style={{
                    width: "22rem",
                    marginTop: "5rem",
                    marginBottom: "1rem",
                  }}
                  alt="pending"
                  src={Pending}
                />
                <h1>Please wait, your transaction will be processed.</h1>
              </>
            ) : profile?.userPayment[0].status === "Cancel" ? (
              <>
                <img
                  style={{
                    width: "22rem",
                    marginTop: "5rem",
                    marginBottom: "1rem",
                  }}
                  alt="cancel"
                  src={Cancel}
                />
                <h1>Your payment is canceled. please chat admin.</h1>
              </>
            ) : (
              profile?.userPayment[0].dueDate && (
                <>
                  <img
                    style={{
                      width: "22rem",
                      marginTop: "5rem",
                      marginBottom: "1rem",
                    }}
                    alt="active"
                    src={Paid}
                  />
                  <h1>Yeay, Your account active until {expired}.</h1>
                </>
              )
            )
          ) : (
            <>
              <h1 className="fw-800 ff-avenir mb-5">Premium</h1>
              <p>
                Bayar sekarang dan nikmati streaming music yang kekinian dari{" "}
                <span className="red-color fw-800">DUMB</span>
                <span className="fw-800">SOUND</span>
              </p>
              <p>
                <span className="red-color fw-800">DUMB</span>
                <span className="fw-800">SOUND : 0981312323</span>
              </p>
              <Form className="ml-auto" style={{ padding: "0 22%" }}>
                {true && message}
                <Form.Group className="mb-3 " controlId="formAcc">
                  <Form.Control
                    className="form-color"
                    // onChange={handleOnChange}
                    // value={email}
                    name="acc"
                    size="sm"
                    type="number"
                    placeholder="Input Your Acount Number"
                  />
                </Form.Group>
                <div className="mb-3">
                  <input
                    ref={inputRef}
                    onChange={handleChange}
                    name="attache"
                    className="d-none"
                    type="file"
                  />
                  <Button
                    style={{ backgroundColor: "transparent" }}
                    className="upload-btn red-color"
                    onClick={() => inputRef.current?.click()}
                  >
                    <div className="d-flex justify-content-between px-1 fw-800">
                      {uploadedFileName
                        ? String(uploadedFileName).length > 20
                          ? String(uploadedFileName).substring(0, 20) + " ..."
                          : uploadedFileName
                        : "Attache proof of your transfer"}
                      <img
                        className="upload-btn-icon"
                        src={UploadIcon}
                        alt="upload"
                      />{" "}
                    </div>
                  </Button>
                  {uploadedFileName && (
                    <>
                      <div>
                        <img
                          src={preview}
                          className="prev-img mt-2"
                          alt="preview"
                        />
                      </div>
                    </>
                  )}
                </div>
                <Button
                  onClick={(e) => handleSubmit.mutate(e)}
                  className="mt-4 orange-btn w-100 d-flex justify-content-center"
                  type="submit"
                  size="sm"
                >
                  <div className="me-3">Send</div>
                  {handleSubmit.isLoading && (
                    <ReactLoading type="spin" height="5%" width="5%" />
                  )}
                </Button>
                <div className="mt-4">
                  <p className="red-color">
                    Atau bayar dengan pilihan pembayaran lain
                  </p>
                  <Button
                    onClick={(e) => handlePay.mutate(e)}
                    className="orange-btn w-100 d-flex justify-content-center"
                    type="submit"
                    size="sm"
                  >
                    <div className="me-3">Pay with other method</div>
                    {handleSubmit.isLoading && (
                      <ReactLoading type="spin" height="5%" width="5%" />
                    )}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </div>
      </Container>
    </>
  )
}
