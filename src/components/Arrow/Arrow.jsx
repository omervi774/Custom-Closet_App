import React from 'react'
import { Box, Paper, Icon } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ArrowBack } from '@mui/icons-material'

// This component displays a container and inside it left/right arrow
// When clicking on the arrow:
// If it is right arrow, display the next order
// If it is left arrow, display the previous order
function Arrow({ arrowType, handleClick }) {
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        margin: '10px', // Add margin for spacing
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
        <Icon component={arrowType === 'forward' ? ArrowForwardIcon : ArrowBack} fontSize="large" sx={{ color: '#5f7b8c' }} />
      </Paper>
    </Box>
  )
}

export default Arrow
