import React from "react";
import useLogIn from "../useLogIn";
import { loginModalStyle } from "../consts/consts";
import { phoneLogInStyle } from "../consts/consts";
import { Button, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
function LogInForm() {
  const [inputsValues, handleChange] = useLogIn();
  const isDeskTopSize = useMediaQuery("(min-width:600px)");
  return (
    <Box
      component="form"
      variant="div"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("userName:", inputsValues.userName);
        console.log("password", inputsValues.password);
      }}
      color="success.main"
      sx={loginModalStyle.formStyle}
    >
      <TextField
        name="userName"
        value={inputsValues.userName}
        onChange={handleChange}
        id="username-field"
        label="שם משתמש"
        variant="filled"
        sx={
          isDeskTopSize
            ? loginModalStyle.inputTexts
            : phoneLogInStyle.inputTexts
        }
        InputLabelProps={{
          sx: isDeskTopSize
            ? loginModalStyle.inputLabels
            : phoneLogInStyle.inputLabels,
        }}
        InputProps={{
          sx: { color: "black" },
        }}
      />
      <TextField
        name="password"
        value={inputsValues.password}
        onChange={handleChange}
        id="password-field"
        label="סיסמא"
        variant="filled"
        type="password"
        sx={
          isDeskTopSize
            ? loginModalStyle.inputTexts
            : phoneLogInStyle.inputTexts
        }
        InputLabelProps={{
          sx: isDeskTopSize
            ? loginModalStyle.inputLabels
            : phoneLogInStyle.inputLabels,
        }}
        InputProps={{
          sx: { color: "black" },
        }}
      />
      <Button
        type="submit"
        color="success"
        variant="contained"
        sx={
          isDeskTopSize
            ? { color: "white", ...loginModalStyle.buttons }
            : phoneLogInStyle.buttons
        }
        children="התחבר"
      />
      {isDeskTopSize && (
        <Button
          color="success"
          variant="outlined"
          sx={loginModalStyle.buttons}
          children="הרשמה"
        />
      )}

      <Typography
        id="modal-modal-title"
        component="p"
        sx={isDeskTopSize ? loginModalStyle.text : phoneLogInStyle.text}
      >
        שכחתי פרטי זיהוי
      </Typography>
    </Box>
  );
}

export default LogInForm;
