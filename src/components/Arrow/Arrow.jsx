import React from 'react'
import { Box, Paper, Icon } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ArrowBack } from '@mui/icons-material'

// this component display container and inside it left/right arrow
//when clicking on the arrow:
// if it is right arrow display the next order
// if is is left arrow display the prev order
function Arrow({ arrowType, handleClick, leftPosition }) {
  //   return <div style={{height:30,width:30,backgroundColor:"white"}}>

  //   </div>
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //minHeight: '100vh', // Full screen height to center the container
        backgroundColor: '#f5f5f5', // Light background color
        position: 'absolute',
        top: '83%',
        left: `${leftPosition}%`,
        borderRadius: '10px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '50px', // Fixed width
          height: '50px', // Fixed height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          backgroundColor: '#ffffff', // White background for the paper
          cursor: 'pointer',
        }}
      >
        <Icon component={arrowType === 'forward' ? ArrowForwardIcon : ArrowBack} fontSize="large" color="primary" />
      </Paper>
    </Box>
  )
}

export default Arrow
