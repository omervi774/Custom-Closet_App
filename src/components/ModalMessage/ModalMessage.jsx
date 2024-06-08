import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AnimatedArrow from '../AnimatedArrow/AnimatedArrow'

// const style = {
//   display: 'flex',
//   justifyContent: 'center',
// }

const ModalMessage = ({ typeOfMessage, title, content, onCloseModal, topPosition, leftPosition, arrow }) => {
  const style = {
    position: 'absolute',
    top: `${topPosition}`,
    left: `${leftPosition}`,
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',

    borderRadius: '30px', // Add border radius here
    // border: '2px solid #000',
    //boxShadow: 24,
    p: 4,
  }

  const [visible, setVisible] = useState('visible')
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible('hidden')
      if (onCloseModal) {
        onCloseModal()
      }
    }, 2000) // 3 seconds

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [onCloseModal])

  if (!visible) return null
  return (
    <div style={{ display: 'flex' }}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', visibility: visible }}>
          <Typography
            sx={{ color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {title !== '' && title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}>
            {content !== '' && content}
          </Typography>
        </Box>
      </Box>
      {arrow === true && (
        // <ArrowBackIcon fontSize="large" style={{ position: 'absolute', top: '17%', left: '15%', transform: 'scaleX(4)' }} />
        <AnimatedArrow />
      )}
    </div>
  )
}

export default ModalMessage
