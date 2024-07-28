import { Typography, Box, Button, Tooltip } from '@mui/material'
import { useState } from 'react'

const ShelfUi = ({ title, addNewShelf, closeSecondaryMenu }) => {
  const [clicked, setClicked] = useState('glass')

  return (
    <div
      style={{
        marginRight: '1.95rem',
        border: '2px solid black',
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center', // Center items vertically
        height: '50vh', // Make the container full height for centering effect
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          color: 'black',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold', // Makes the text bold
            marginBottom: '10px', // Adds some margin at the bottom
          }}
        >
          {' '}
          {title}
        </Typography>
        <Typography>צבע:</Typography>
        <Tooltip title="זכוכית" placement="left">
          <Box
            onClick={() => setClicked('glass')}
            sx={{
              height: 40,
              width: 40,
              backgroundImage: 'linear-gradient(45deg, #dafbff, #eefdff, #bbf9ff)', // Gradient background
              cursor: 'pointer',
              borderColor: 'lightgreen',
              borderStyle: clicked === 'glass' ? 'solid' : 'none',
              borderRadius: '15px',
            }}
          />
        </Tooltip>
        <Tooltip title="עץ" placement="left">
          <Box
            onClick={() => setClicked('wood')}
            sx={{
              height: 40,
              width: 40,
              backgroundImage: 'linear-gradient(135deg, #df8402, #bc6a3c, #c69874, #d5b07c)', // Gradient background
              cursor: 'pointer',
              borderColor: 'lightgreen',
              borderStyle: clicked === 'wood' && 'solid',
              borderRadius: '15px',
            }}
          />
        </Tooltip>
        <Tooltip title="ברזל" placement="left">
          <Box
            onClick={() => setClicked('metal')}
            sx={{
              height: 40,
              width: 40,
              backgroundColor: 'black',
              cursor: 'pointer',
              borderColor: 'lightgreen',
              borderStyle: clicked === 'metal' && 'solid',
              borderRadius: '15px',
            }}
          />
        </Tooltip>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: 'black',
            width: 'auto',
            marginTop: 2,
            fontFamily: 'Calibri, sans-serif',
            flexShrink: 0,
            borderColor: 'black', // Set the border color

            '&:hover': {
              backgroundColor: '#f3efeb', // Optional: Set a darker color for hover effect
            },
          }}
          onClick={() => {
            addNewShelf(clicked)
            setClicked('glass')
          }}
        >
          אישור
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: 'black',
            width: 'auto',
            fontFamily: 'Calibri, sans-serif',
            flexShrink: 0,
            borderColor: 'black', // Set the border color

            '&:hover': {
              backgroundColor: '#f3efeb', // Optional: Set a darker color for hover effect
            },
          }}
          onClick={closeSecondaryMenu}
        >
          חזור
        </Button>
      </Box>
    </div>
  )
}

export default ShelfUi
