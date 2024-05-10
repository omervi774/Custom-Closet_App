import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
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
  return (
    <div>
      <Modal
        open={true}
        onClose={onCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography
              sx={{ color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              {typeOfMessage === 'success' ? '! חיבור קוביות חוקי' : 'חיבור קוביות לא חוקי'}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, color: typeOfMessage === 'success' ? 'lightgreen' : 'darkred' }}
            >
              {typeOfMessage === 'success'
                ? 'המשך לחבר קוביות כרצונך'
                : 'החיבור לא הצליח כי הקובייה המתחברת עלתה על קובייה קיימת, נסה מחדש'}
            </Typography>
            <Box
              onClick={onCloseModal}
              sx={{
                backgroundColor: typeOfMessage === 'success' ? 'lightgreen' : 'darkred',
                height: 40,
                width: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 3,
                cursor: 'pointer',
              }}
            >
              {typeOfMessage === 'success' ? (
                <DoneIcon sx={{ color: 'white' }} fontSize="large" />
              ) : (
                <CloseIcon sx={{ color: 'white' }} fontSize="large" />
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default ModalMessage
