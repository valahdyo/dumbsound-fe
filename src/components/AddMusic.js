import { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import ReactLoading from "react-loading"
import { useQuery, useMutation } from "react-query"
import { API } from "../config/api"
import { Form, Row, Col, Button, Container, Alert } from "react-bootstrap"
import UploadIcon from "../assets/upload-icon.png"

export default function AddMusic() {
  const attacheRef = useRef(null)
  const thumbnailRef = useRef(null)
  const [thumbnailName, setThumbnailName] = useState(null)
  const [musicName, setMusicName] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    title: "",
    thumbnail: "",
    year: "",
    artisId: "",
    attache: "",
  })
  const { title, year, artisId } = form

  /**
   * Fetching artist list from database using react-query and axios
   */
  let { data: artistList } = useQuery("artistListCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/artist", config)

    return response?.data.artis
  })

  /**
   * Handle when user make change in input form
   * @param {object} e field name, value, and files
   */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    })
    /**
     * Set preview file name if user uploaded new file
     */
    if (e.target.type === "file") {
      if (thumbnailRef.current.files.length > 0) {
        setThumbnailName(thumbnailRef.current.files[0].name)
      }
      if (attacheRef.current?.files) {
        setMusicName(attacheRef.current.files[0].name)
      }
    }
  }

  /**
   * Clear all field when submit success
   */
  const clearForm = () => {
    setForm({
      title: "",
      thumbnail: "",
      year: "",
      artisId: "",
      attache: "",
    })
    attacheRef.current.value = null
    thumbnailRef.current.value = null
    setMusicName(null)
    setThumbnailName(null)
  }

  /**
   * Handle when user click submit
   * Create new form-data object and send it to backend using API
   * Set alert message when success or failed
   */
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const formData = new FormData()
      if (!form.thumbnail[0] && !form.attache[0]) {
        console.log("error")
        throw new Error("Please fill in all fields!")
      }
      formData.set("thumbnail", form?.thumbnail[0], form.thumbnail[0]?.name)
      formData.set("attache", form?.attache[0], form.attache[0]?.name)
      formData.set("title", form.title)
      formData.set("year", form.year)
      formData.set("artisId", form.artisId)
      console.log("formdata", formData)

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
      console.log(form)
      const response = await API.post("/music/add", formData, config)
      if (response.status == 200) {
        clearForm()
        const alert = (
          <Alert variant="success" className="py-1">
            Add Music Success
          </Alert>
        )
        setMessage(alert)
      }
    } catch (error) {
      console.log(error)
      clearForm()
      const alert = (
        <Alert variant="danger" className="py-1">
          Please fill in all fields!
        </Alert>
      )
      setMessage(alert)
    }
  })
  return (
    <>
      <Container>
        <div className="profile-heading text-left h3 mt-5 mb-4 text-white ff-avenir fw-800">
          Add Music
        </div>
        <Row className="d-flex justify-content-left">
          <Col lg="11">
            {true && message}
            <Form /*onSubmit={handleOnSubmit}*/>
              <Form.Group className="mb-3" controlId="formTitle">
                <Row>
                  <Col lg={9}>
                    <Form.Control
                      className="form-color"
                      onChange={handleChange}
                      value={title}
                      name="title"
                      size="sm"
                      type="text"
                      placeholder="Title"
                    />
                  </Col>
                  <Col>
                    <Button
                      className="upload-btn"
                      onClick={() => thumbnailRef.current?.click()}
                    >
                      <div className="d-flex justify-content-between px-1">
                        {thumbnailName
                          ? String(thumbnailName).length > 12
                            ? String(thumbnailName).substring(0, 12) + " ..."
                            : thumbnailName
                          : "Attach Thumbnail"}
                        <img
                          className="upload-btn-icon"
                          src={UploadIcon}
                          alt="upload"
                        />{" "}
                      </div>
                    </Button>

                    <input
                      ref={thumbnailRef}
                      onChange={handleChange}
                      name="thumbnail"
                      className="d-none"
                      type="file"
                    />
                    {/* <Button
                        onClick={() => thumbnailRef.current?.click()}
                        className="donate-btn"
                        style={{ width: "100%" }}
                      >
                        Attach Thumbnail
                      </Button> */}
                    {/* {uploadedFileName && (
                        <>
                          <button
                            // onClick={resetFile}
                            type="button"
                            class="close float-none ml-3"
                            aria-label=""
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <span className="ml-2">{uploadedFileName}</span>
                          <div>
                            <img
                              src={preview}
                              className="prev-img mt-2"
                              alt="preview"
                            />
                          </div>
                        </>
                      )} */}
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicYear">
                <Form.Control
                  className="form-color"
                  onChange={handleChange}
                  value={year}
                  name="year"
                  size="sm"
                  type="number"
                  placeholder="Year"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicSinger">
                <Form.Select
                  size="sm"
                  className="form-color"
                  value={artisId}
                  aria-label="Default select example"
                  name="artisId"
                  required
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    Artist
                  </option>
                  {artistList?.map((item) => {
                    return <option value={item.id}>{item.name}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <div>
                <input
                  ref={attacheRef}
                  onChange={handleChange}
                  name="attache"
                  className="d-none"
                  type="file"
                />
                <Button
                  className="upload-btn"
                  style={{ width: "15%" }}
                  onClick={() => attacheRef.current?.click()}
                >
                  <div className="d-flex justify-content-between px-1">
                    {musicName
                      ? String(musicName).length > 7
                        ? String(musicName).substring(0, 7) + " ..."
                        : musicName
                      : "Attach Music"}
                  </div>
                </Button>
                {/* {uploadedFileName && (
                  <>
                    <button
                      //   onClick={resetFile}
                      type="button"
                      class="close float-none ml-3"
                      aria-label=""
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </>
                )} */}
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  onClick={(e) => handleSubmit.mutate(e)}
                  // style={{ marginLeft: "75%" }}
                  className="mt-3 orange-btn w-25 text-center d-flex justify-content-center"
                  type="submit"
                  size="sm"
                >
                  <div className="me-3">Add Music</div>
                  {handleSubmit.isLoading && (
                    <ReactLoading type="spin" height="8%" width="8%" />
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}
