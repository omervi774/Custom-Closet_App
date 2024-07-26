import React from 'react'
import Box from '@mui/material/Box'

import Modal from '@mui/material/Modal'

import { loginModalStyle } from '../consts/consts'
import LogInHeader from '../LogInHeader/LogInHeader'

import LogInForm from '../LogInForm/LogInForm'
export default function LoginModal(props) {
  return (
    <Modal open={props.open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={loginModalStyle.modalWrapper}>
        <LogInHeader icon="clear" clickedIcon={props.handleClose} text="התחברות מנהל" />
        <LogInForm handleClose={props.handleClose} />
      </Box>
    </Modal>
  )
}
