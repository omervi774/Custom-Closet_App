import { useTheme } from "@emotion/react";
import React, { useState } from "react";

import style from "./headerStyle";
import { useNavigate } from "react-router-dom";
import { Box, Button, List, Stack, Typography } from "@mui/material";
import LoginModal from "../LoginModal/LoginModal";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";

import NavigationMenu from "../NavigationMenu/NavigationMenu";

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate(); // allow navigation to different pages
  const [openLogInModal, setOpenLogInModal] = useState(false); // state that responssible when the modal is open/close
  const handleOpen = () => setOpenLogInModal(true); // open the modal
  const handleClose = () => setOpenLogInModal(false); // close the modal
  const [openHamburgerMenu, setOpenHamburgerMenu] = useState(false); // state that responssible when the hamburgerMenu is open/close

  // change the state of the hamburger menu
  const handleToggleDrawer = () => {
    setOpenHamburgerMenu(!openHamburgerMenu);
  };

  const isDesktopScreen = useMediaQuery("(min-width:600px)"); // return true if the size compatible for desktop otherwise false
  return (
    <Box>
      {/* nav bar styling */}
      <Box
        color="theme.secondary.light"
        sx={{
          //backgroundColor: theme.palette.secondary.light,
          backgroundColor: theme.palette.background.teal,

          ...style.wrapper,
          justifyContent: isDesktopScreen ? "space-around" : "space-between",
        }}
      >
        {/*   register and login buttons */}
        <Stack direction="row" spacing="1rem " color="success">
          {isDesktopScreen && (
            <Button color="success" variant="contained" sx={{ color: "white" }}>
              הרשמה
            </Button>
          )}

          <Button
            color="success"
            variant="contained"
            sx={{
              color: "white",
              width: isDesktopScreen ? "auto" : "100%",
            }}
            onClick={
              isDesktopScreen
                ? handleOpen
                : () => {
                    navigate("phoneLogIn");
                  }
            }
          >
            התחבר
          </Button>
        </Stack>
        {/* on desktop screen display the navigation items otherwise display the hamburger menu */}
        {isDesktopScreen ? (
          <List sx={style.itemsWrapper}>
            <NavigationMenu color={theme.palette.text.primary} />
          </List>
        ) : (
          <>
            <IconButton
              color="white"
              aria-label="open drawer"
              edge="start"
              onClick={handleToggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon
                sx={{ color: "white" }}
                color="white"
                fontSize="large"
              />
            </IconButton>
            {/* the menu that opens when the user click on the hamburger icon */}
            <Drawer
              anchor="top"
              open={openHamburgerMenu}
              onClose={handleToggleDrawer}
            >
              <List sx={style.drawerStyle}>
                <Typography variant="h3" component="a">
                  הארונות שלנו
                </Typography>
                <NavigationMenu
                  color="white"
                  toolTipPlacement="left"
                  handleToggleDrawer={handleToggleDrawer}
                />
              </List>
            </Drawer>
          </>
        )}
        {isDesktopScreen && (
          <Typography
            variant="h3"
            component="a"
            onClick={() => navigate("/")}
            color={"white"}
            style={style.heading}
          >
            הארונות שלנו
          </Typography>
        )}
      </Box>
      <LoginModal open={openLogInModal} handleClose={handleClose} />
    </Box>
  );
}
