import { Box, Typography } from "@mui/material";
import { React } from "react";
import { useNavigate } from "react-router-dom";
import LogInHeader from "../components/LogInHeader/LogInHeader";

import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import LogInForm from "../components/LogInForm/LogInForm";
export default function PhoneLogIn() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          width: "100%",
          backgroundColor: "white",
          //   display: "flex",
          //   flexDirection: "column",
          //alignItems: "center",
        }}
      >
        <LogInHeader
          icon="arrow"
          clickedIcon={() => {
            navigate(-1);
          }}
          text="הארונות שלנו"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <ArrowCircleLeftOutlinedIcon
            //color="grey"
            sx={{
              fontSize: "13rem",
              position: "absolute",
              right: "-5rem", // Adjust this value to start off the screen
              top: "1.2rem",

              bgcolor: "white",
              color: "grey",

              zIndex: 1,
            }}
          />
          <Typography
            component="p"
            variant="h2"
            children="התחברות"
            sx={{ paddingTop: "7rem", marginBottom: "4rem", zIndex: 2 }}
          />
          <LogInForm />
        </Box>
      </Box>
    </>
  );
}
