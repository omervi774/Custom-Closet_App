import React from "react";
import { useTheme } from "@emotion/react";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

function App() {
  const theme = useTheme();
  const location = useLocation();
  const pagesWithoutHeader = ["/phoneLogIn"];

  // Check if the current location is in the list of pages without the Header
  const shouldHideHeader = pagesWithoutHeader.includes(location.pathname);
  return (
    <>
      {/* // container for all the pages in the app */}
      <Box
        style={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          margin: 0,
          padding: 0,
          flex: 1,
        }}
      >
        {/* nav bar that appear at all of the pages except the phoneLogIn page */}
        {!shouldHideHeader && <Header />}

        {/* this component make the nav-bar and the container appear at every page */}
        <Outlet />
      </Box>
    </>
  );
}

export default App;
