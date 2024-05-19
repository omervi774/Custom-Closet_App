import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
const style = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  // border: '2px solid #000',
  //boxShadow: 24,
  p: 4,
}
// const style = {
//   display: 'flex',
//   justifyContent: 'center',
// }

const ModalMessage = ({ typeOfMessage, onCloseModal }) => {
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
    <div>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', visibility: visible }}>
          <Typography
            sx={{ color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {typeOfMessage === 'success' ? '! חיבור קוביות חוקי' : 'חיבור קוביות לא חוקי'}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}>
            {typeOfMessage === 'success' ? 'המשך לחבר קוביות כרצונך' : 'החיבור לא הצליח כי הקובייה המתחברת עלתה על קובייה קיימת, נסה מחדש'}
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

export default ModalMessage
