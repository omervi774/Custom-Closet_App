import { useState } from 'react'
import { Button, Typography } from '@mui/material'
// let the use choose the size of the new cube he is gonna drag
const CubeUi = ({ title, newDraggingCube, closeSecondaryMenu }) => {
  const [clicked, setClicked] = useState({ width: [true, false, false], height: [true, false, false] })
  const handleClicked = (indicator, id) => {
    setClicked((prev) => {
      const newVal = clicked[indicator].map((val, index) => {
        if (index + 1 === id) {
          return true
        } else {
          return false
        }
      })
      console.log(newVal)
      return {
        ...prev,
        [indicator]: newVal,
      }
    })
  }
  return (
    <>
      <div
        style={{
          marginRight: '1rem',
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold', // Makes the text bold
            marginBottom: '20px', // Adds some margin at the bottom
          }}
        >
          {title}
        </Typography>
        <Typography>רוחב:</Typography>

        <Button variant={clicked['width'][0] ? 'outlined' : 'text'} onClick={() => handleClicked('width', 1)}>
          1
        </Button>
        <Button variant={clicked['width'][1] ? 'outlined' : 'text'} onClick={() => handleClicked('width', 2)}>
          2
        </Button>
        <Button variant={clicked['width'][2] ? 'outlined' : 'text'} onClick={() => handleClicked('width', 3)}>
          3
        </Button>

        <Typography>גובה:</Typography>
        <Button variant={clicked['height'][0] ? 'outlined' : 'text'} onClick={() => handleClicked('height', 1)}>
          1
        </Button>
        <Button variant={clicked['height'][1] ? 'outlined' : 'text'} onClick={() => handleClicked('height', 2)}>
          2
        </Button>
        <Button variant={clicked['height'][2] ? 'outlined' : 'text'} onClick={() => handleClicked('height', 3)}>
          3
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
            marginBottom: 1,

            '&:hover': {
              backgroundColor: '#f3efeb', // Optional: Set a darker color for hover effect
            },
          }}
          onClick={() => {
            let width = 0
            let height = 0
            clicked['width'].forEach((val, index) => {
              if (val) {
                width = index + 1
              }
            })
            clicked['height'].forEach((val, index) => {
              if (val) {
                height = index + 1
              }
            })
            newDraggingCube(width, height)
            setClicked({ width: [true, false, false], height: [true, false, false] })
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
      </div>
    </>
  )
}
export default CubeUi
