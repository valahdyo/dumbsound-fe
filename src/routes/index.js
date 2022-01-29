import { Route, Switch } from "react-router-dom"
import UserRoute from "./UserRoute"
import AdminRoute from "./AdminRoute"
import Homepage from "../pages/Home"
import User from "../pages/User"
import Admin from "../pages/Admin"
import AddArtistPage from "../pages/AddArtis"
import AddMusicPage from "../pages/AddMusic"
import ChatUser from "../pages/ChatUser"
import ChatAdmin from "../pages/ChatAdmin"
import Profile from "../pages/Profile"
import EditProfile from "../pages/EditProfile"

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Homepage} />
      <UserRoute exact path="/user" component={User} />
      <UserRoute exact path="/user/chat" component={ChatUser} />
      <UserRoute exact path="/user/profile" component={Profile} />
      <UserRoute exact path="/user/edit-profile" component={EditProfile} />
      <AdminRoute exact path="/admin" component={Admin} />
      <AdminRoute exact path="/admin/chat" component={ChatAdmin} />
      <AdminRoute exact path="/admin/add-artist" component={AddArtistPage} />
      <AdminRoute exact path="/admin/add-music" component={AddMusicPage} />
      <Route
        path="*"
        component={() => {
          return (
            <h1 className="display-4 font-weight-bold light-color text-center mt-5">
              404 Not Found
            </h1>
          )
        }}
      />
    </Switch>
  )
}

export default Routes
