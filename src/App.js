import React from "react";
import { useTheme } from "@emotion/react";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
  const theme = useTheme();
  const location = useLocation();
  const pagesWithoutHeader = ["/phoneLogIn"];

  // Check if the current location is in the list of pages without the Header
  const shouldHideHeader = pagesWithoutHeader.includes(location.pathname);
  return (
    <>
      <style>{`
        body, html,#root  {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>
      <div
        style={{
          backgroundColor: theme.palette.background.default,
          //backgroundColor: theme.palette.info.light,
          height: "100vh",
          margin: 0,
          padding: 0,
          flex: 1,
          // display: "flex",
          // flexDirection: "column",
        }}
      >
        {!shouldHideHeader && <Header />}

        <Outlet />
      </div>
    </>
  );
}

export default App;
