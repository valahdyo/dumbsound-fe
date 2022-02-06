import { API } from "../config/api"
import { useQuery } from "react-query"
import { useHistory } from "react-router-dom"
import ProfilePhoto from "../assets/profile-photo.png"
import NoData from "../assets/noData-2.svg"

import NavbarComponent from "../components/Navbar"
import { Button, Container, Row, Col } from "react-bootstrap"

function Profile() {
  let history = useHistory()
  /**
   * Request data from backend for user data
   */
  let { data: profile } = useQuery("profileCache", async () => {
    const response = await API.get("/user/profile")

    return response.data.data
  })

  if (profile?.userPayment.length > 0) {
    var expired = null

    profile?.userPayment.map((item, index) => {
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
                <Button
                  className="red-btn w-100 mt-3"
                  onClick={() => history.push("/user/edit-profile")}
                >
                  Edit Profile
                </Button>
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
            <h1 className="profile-heading light-color">Payment History</h1>
            {profile?.userPayment.length > 0 ? (
              profile?.userPayment.map((item, index) => {
                let date = new Date(item.createdAt)
                date = date.toDateString().split(" ")
                let proof = String(item.attache)
                return (
                  <Row className="mb-3">
                    <Col>
                      <div key={index} className="history-box light-color">
                        <h3 className="history-heading light-color">
                          <strong style={{ fontWeight: 900 }}>
                            {date[0]},{" "}
                          </strong>
                          {date[1]} {date[2]} {date[3]}
                        </h3>
                        <p className="history-date light-color">
                          <strong style={{ fontWeight: 900, fontSize: "12px" }}>
                            Rp. 50.000
                          </strong>
                          <strong style={{ fontWeight: 900, fontSize: "12px" }}>
                            <a
                              className="text-decoration-none light-color float-end"
                              target="blank"
                              href={item.attache}
                            >
                              {proof.substring(86)}
                            </a>
                          </strong>
                        </p>

                        <Row>
                          <Col>
                            {item.status === "Approve" ? (
                              <p className="history-status-success ">
                                Finished
                              </p>
                            ) : item.status === "Cancel" ? (
                              <p className="history-status-cancel">Cancel</p>
                            ) : (
                              <p className="history-status-pending">Pending</p>
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )
              })
            ) : (
              <>
                <img
                  style={{
                    opacity: "0.5",
                    marginTop: "4rem",
                  }}
                  className="d-block w-50 mx-auto mb-4"
                  src={NoData}
                  alt="no-data"
                ></img>
                <h4
                  style={{ opacity: "0.5" }}
                  className="text-center light-color"
                >
                  No Data
                </h4>
              </>
            )}
            {}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
