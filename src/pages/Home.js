import { useState, useContext } from "react"
import { useHistory } from "react-router-dom"

import { useQuery } from "react-query"
import { API } from "../config/api"

import ReactJkMusicPlayer from "react-jinke-music-player"
import NavbarComponent from "../components/Navbar"
import { Card, Col, Container, Image, Row } from "react-bootstrap"

import HeaderBackground from "../assets/header-image.png"
import LoginModal from "../components/LoginModal"
import RegisterModal from "../components/RegisterModal"
import MusicCard from "../components/Card/MusicCard"
import { AuthContext } from "../context/AuthContext"

function Homepage() {
  let history = useHistory()

  const [state] = useContext(AuthContext)
  const [playlist, setPlaylist] = useState([])
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  /**
   * Fetching music list data from database using react query and axios
   */
  let { data: musicList } = useQuery("musicListCache", async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    }
    const response = await API.get("/music", config)
    return response?.data.data
  })

  /**
   * Create new object for playing audio on react-jinke
   */
  let audioList = musicList?.map((item, index) => {
    return {
      name: item.title,
      singer: item.artist?.name,
      cover: item.thumbnail,
      musicSrc: item.attache,
    }
  })

  /**
   * Handling show or hide modals (login and register)
   * @returns boolean true or false
   */
  const handleShowLogin = () => setShowLogin(true)
  const handleShowRegister = () => setShowRegister(true)
  const closeLogin = () => setShowLogin(false)
  const closeRegister = () => setShowRegister(false)

  /**
   * Handling when user click music card. Set music list state and play music
   * @param {int} music item index
   */
  const handlePlay = (music) => {
    if (state.isLogin === true) {
      if (state.user.subscribe !== 0) {
        setPlaylist([audioList[music]])
      } else {
        history.push("/user")
      }
    } else {
      handleShowLogin()
    }
  }

  return (
    <>
      <NavbarComponent />
      <Container fluid className="header-wrapper">
        <div className="header-desc light-color text-center">
          <h1 className="heading-font-header">Connect on DumbSound</h1>
          <p>
            Discovery, Stream, and share a constantly expanding mix of music
            from emerging and major artists around the world
          </p>
        </div>
      </Container>
      <Container className="content-wrapper p-4" fluid>
        <p className="red-color fw-700 f-24 text-center">
          Dengarkan Dan Rasakan
        </p>
        <div className="mt-5 px-5">
          <Row lg={6}>
            {musicList?.map((item, index) => {
              return (
                <MusicCard handlePlay={handlePlay} item={item} index={index} />
              )
            })}
          </Row>
        </div>
      </Container>
      {playlist.length >= 1 && (
        <ReactJkMusicPlayer
          mode="full"
          theme="dark"
          clearPriorAudioLists={true}
          showThemeSwitch={false}
          showPlayMode={false}
          showDownload={false}
          quietUpdate={true}
          audioLists={playlist}
          defaultPosition={{ bottom: 0, left: 0 }}
        />
      )}
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

export default Homepage
