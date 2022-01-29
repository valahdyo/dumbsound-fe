import ListTransaction from "../components/ListTransaction"
import NavbarComponent from "../components/Navbar"
import AddArtist from "../components/AddArtist"
import AddMusic from "../components/AddMusic"

export default function AddMusicPage() {
  return (
    <>
      <NavbarComponent shadow={true} />
      {/* <ListTransaction />
      {/* <AddArtist /> */}
      <AddMusic />
    </>
  )
}
