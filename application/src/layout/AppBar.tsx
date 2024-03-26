import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Home } from "@mui/icons-material";
import { Button, Icon } from "@mui/material";
import { UserContext } from "../contexts/user";
import Cookies from "js-cookie";
import { useAuthContext } from "@asgardeo/auth-react";

function UserMenu() {

  const {
    state,
    signOut
  } = useAuthContext();

  // Retrieve the user information from session storage
  var userInfoString = sessionStorage.getItem("userInfo");

  // Ensure userInfoString is not null before parsing
  if (userInfoString !== null) {
    // Convert the JSON string back to an object
    var userInfo = JSON.parse(userInfoString);

    // Now you can access individual properties of the userInfo object
    var email = userInfo.email;
    var id = userInfo.id;
    var name = userInfo.name;
    var mobileNumber = userInfo.mobileNumber;

  } else {
    console.error("User info not found in session storage.");
  }

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  if (!state.isAuthenticated) {
    return null;
  }

  /**
   * handles the error occurs when the logout consent page is enabled
   * and the user clicks 'NO' at the logout consent page
   */

  const handleLogout = () => {
    signOut();
    
  };


  return (
    <button
      className="btn primary" style={{ margin: "10px" }}
      onClick={() => {
        handleLogout();
      }}
    >
      Logout
    </button>

  );
}

function Header() {
  return (
    <AppBar
      position="static"
      color="primary"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        paddingLeft: "16px",
        paddingRight: "16px",
        backgroundColor: "white"
      }}
    >
      <a href="/" ><div className="headercontent" style={{
        backgroundImage: `url(${require("../resources/logo.png")}`, backgroundSize: 'cover',
      }} /></a>

      <div style={{ display: "flex", alignItems: "center", color: "black", fontWeight: "bold" }}>


        {sessionStorage.getItem("userInfo") !== null ? (
          <a href="/" >
            <h3 style={{ margin: "20px" }}>Home</h3>
          </a>
        ) : (null)}

        {sessionStorage.getItem("userInfo") !== null ? (
          <a href="/reservations">
            <h3 style={{ margin: "20px" }}>My Tickets</h3>
          </a>

        ) : (null)}

        <a href="/" >
          <h3 style={{ margin: "20px" }}>Contact Us</h3>
        </a>

      </div>
      <UserMenu />
    </AppBar>
  );
}
export default Header;
