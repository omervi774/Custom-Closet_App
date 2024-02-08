import React from "react";
import { Box } from "@mui/material";

import { Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LogInHeader(props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.default",
        color: "text.primary",
        height: "7vh",
        width: "100%",
      }}
    >
      {props.icon === "clear" ? (
        <ClearIcon
          onClick={props.clickedIcon}
          sx={{ cursor: "pointer", paddingLeft: "1rem" }}
        />
      ) : (
        <ArrowBackIcon
          sx={{ cursor: "pointer", paddingLeft: "1rem" }}
          onClick={props.clickedIcon}
        />
      )}

      <Typography
        sx={{ paddingRight: "1rem" }}
        id="modal-modal-title"
        component="p"
      >
        {props.text}
      </Typography>
    </Box>
  );
}
