import React from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
function Undo({ cancelLastAction }) {
  return (
    <RestartAltIcon fontSize="large" sx={{ position: 'absolute', left: '15%', top: '15%', cursor: 'pointer' }} onClick={cancelLastAction} />
  )
}

export default Undo
