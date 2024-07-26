import React, { useState } from 'react'
import useLogIn from '../useLogIn'
import { loginModalStyle } from '../consts/consts'
import { phoneLogInStyle } from '../consts/consts'
import { Button, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

// the login form, functionallity and styling for the different screens size
function LogInForm({ handleClose }) {
  const [inputsValues, handleChange] = useLogIn()
  const [error, setError] = useState(false)
  const isDeskTopSize = useMediaQuery('(min-width:600px)')
  const navigate = useNavigate()
  return (
    <Box
      component="form"
      variant="div"
      onSubmit={async (e) => {
        e.preventDefault()
        console.log('userName:', inputsValues.email)
        console.log('password', inputsValues.password)
        // if(handleClose){
        //   try {
        //     await handleSubmit()
        //     handleClose()
        //     navigate('/')
        //   } catch (e) {
        //     console.log('omer', e)
        //     //TODO: create popup message that explaind the user he entered wrong details.
        //   }
        // }
        try {
          await signInWithEmailAndPassword(auth, inputsValues.email, inputsValues.password)
          if (handleClose) {
            handleClose()
          }
          navigate('/')
          //const user = userCredential.user
          // const token = await user.getIdToken()
          console.log('succsesfully logged in')
        } catch (error) {
          setError(true)
          setTimeout(() => {
            setError(false)
          }, 3000)
        }
      }}
      color="success.main"
      sx={loginModalStyle.formStyle}
    >
      <TextField
        name="email"
        value={inputsValues.userName}
        onChange={handleChange}
        id="username-field"
        label="אימייל"
        variant="filled"
        sx={isDeskTopSize ? loginModalStyle.inputTexts : phoneLogInStyle.inputTexts}
        InputLabelProps={{
          sx: isDeskTopSize ? loginModalStyle.inputLabels : phoneLogInStyle.inputLabels,
        }}
        InputProps={{
          sx: { color: 'black' },
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
        sx={isDeskTopSize ? loginModalStyle.inputTexts : phoneLogInStyle.inputTexts}
        InputLabelProps={{
          sx: isDeskTopSize ? loginModalStyle.inputLabels : phoneLogInStyle.inputLabels,
        }}
        InputProps={{
          sx: { color: 'black' },
        }}
      />
      {error && (
        <Typography color="darkred" sx={{ marginTop: 1, marginBottom: 2 }}>
          האימייל או סיסמא לא נכונים,נסה שוב
        </Typography>
      )}
      <Button
        type="submit"
        color="success"
        variant="contained"
        sx={isDeskTopSize ? { color: 'white', ...loginModalStyle.buttons } : phoneLogInStyle.buttons}
        children="התחבר"
      />
      {/* {isDeskTopSize && <Button color="success" variant="outlined" sx={loginModalStyle.buttons} children="הרשמה" />}

      <Typography id="modal-modal-title" component="p" sx={isDeskTopSize ? loginModalStyle.text : phoneLogInStyle.text}>
        שכחתי פרטי זיהוי
      </Typography> */}
    </Box>
  )
}

export default LogInForm
