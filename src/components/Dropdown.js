import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useHistory } from "react-router-dom"

import { Dropdown } from "react-bootstrap"
import Avatar from "../assets/avatar.png"
import Admin from "../assets/admin.png"
import Pay from "../assets/pay.png"
import IconLogout from "../assets/icon-logout.png"
import ChatIcon from "../assets/chatico.png"
import Profile from "../assets/profile-icon.png"
import Artis from "../assets/addartis.png"
import Music from "../assets/addmusic.png"

function DropdownComponent() {
  let history = useHistory()

  const [state, dispatch] = useContext(AuthContext)

  const handlePay = (e) => {
    e.preventDefault()
    history.push("/user")
  }

  const handleAddMusic = (e) => {
    e.preventDefault()
    history.push("/admin/add-music")
  }

  const handleAddArtis = (e) => {
    e.preventDefault()
    history.push("/admin/add-artist")
  }
  const handleLogout = (e) => {
    console.log("logout")
    e.preventDefault()
    dispatch({ type: "LOGOUT" })
    history.push("/")
  }
  return (
    <>
      <Dropdown className="pe-1">
        <Dropdown.Toggle id="dropdown-basic">
          <img
            style={{ width: "55px", height: "55px", borderRadius: "50%" }}
            src={state.user.profileImage ? state.user.profileImage : Avatar}
            alt="avatar"
          ></img>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {state.user?.listAs === 1 ? (
            <>
              <Dropdown.Item onClick={handleAddArtis}>
                <img className="me-3" src={Artis} alt="pay" />
                Add Artist
              </Dropdown.Item>
              <>
                <Dropdown.Item onClick={handleAddMusic}>
                  <img className="me-3" src={Music} alt="pay" />
                  Add Music
                </Dropdown.Item>
                <Dropdown.Item onClick={() => history.push("/admin/chat")}>
                  <img
                    className="me-3"
                    style={{ width: "30px", height: "30px" }}
                    src={ChatIcon}
                    alt="chat"
                  />
                  Chat
                </Dropdown.Item>
              </>
            </>
          ) : (
            <>
              <Dropdown.Item onClick={() => history.push("/user/profile")}>
                <img
                  style={{ width: "30px", height: "30px" }}
                  className="me-3"
                  src={Profile}
                  alt="profile"
                />
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handlePay}>
                <img className="me-3" src={Pay} alt="pay" />
                Pay
              </Dropdown.Item>
              <Dropdown.Item onClick={() => history.push("/user/chat")}>
                <img
                  className="me-3"
                  style={{ width: "30px", height: "30px" }}
                  src={ChatIcon}
                  alt="chat-admin"
                />
                Chat Admin
              </Dropdown.Item>
            </>
          )}

          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            <img className="me-3" src={IconLogout} alt="logout" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

export default DropdownComponent
