import { Typography, Box, Button } from '@mui/material'
import { useState } from 'react'

const ShelfUi = ({ title, addNewShelf, closeSecondaryMenu }) => {
  const [clicked, setClicked] = useState('glass')

  return (
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
      <Typography variant="h5"> {title}</Typography>
      <Typography>:צבע</Typography>
      <Box
        onClick={() => setClicked('glass')}
        sx={{
          height: 40,
          width: 40,
          backgroundColor: '#C0C0C0',
          cursor: 'pointer',
          borderColor: 'lightgreen',
          borderStyle: clicked === 'glass' && 'solid',
        }}
      />
      <Box
        onClick={() => setClicked('wood')}
        sx={{
          height: 40,
          width: 40,
          backgroundColor: '#CD853F',
          cursor: 'pointer',
          borderColor: 'lightgreen',
          borderStyle: clicked === 'wood' && 'solid',
        }}
      />
      <Box
        onClick={() => setClicked('metal')}
        sx={{
          height: 40,
          width: 40,
          backgroundColor: 'black',
          cursor: 'pointer',
          borderColor: 'lightgreen',
          borderStyle: clicked === 'metal' && 'solid',
        }}
      />
      <Button
        onClick={() => {
          addNewShelf(clicked)
          setClicked('glass')
        }}
      >
        אישור
      </Button>
      <Button onClick={closeSecondaryMenu}>חזור</Button>
    </Box>
  )
}

export default ShelfUi
