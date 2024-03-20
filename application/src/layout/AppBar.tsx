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

  if (id === "") {
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
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar>       
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => (window.location.pathname = "/reservations")}>
          <Button style={{ textTransform: "none" }}>
            <Typography textAlign="center">My Reservations</Typography>
          </Button>
        </MenuItem>
        <MenuItem
          onClick={ () => {
            handleLogout();
        } }
         
        >
          <Button style={{ textTransform: "none" }}>
            <Typography textAlign="center">Logout</Typography>
          </Button>
        </MenuItem>
      </Menu>
    </Box>
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
        marginBottom: "64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <AutoAwesomeIcon style={{marginRight: 8}} />
        <Typography
          variant="h6"
          noWrap
        >
          Luxury Hotels
        </Typography>
        <IconButton
          onClick={() => {
            window.location.pathname = "/";
          }}
          style={{ color: "white" }}
        >
          <Home />
        </IconButton>
      </div>
      <UserMenu />
    </AppBar>
  );
}
export default Header;
