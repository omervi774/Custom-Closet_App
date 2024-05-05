import { useState } from 'react'
import { Button, Typography } from '@mui/material'
// let the use choose the size of the new cube he is gonna drag
const CubeUi = ({ title, newDraggingCube }) => {
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
      <Typography variant="h5"> {title}</Typography>
      <Typography>:רוחב</Typography>

      <Button variant={clicked['width'][0] && 'outlined'} onClick={() => handleClicked('width', 1)}>
        1
      </Button>
      <Button variant={clicked['width'][1] && 'outlined'} onClick={() => handleClicked('width', 2)}>
        2
      </Button>
      <Button variant={clicked['width'][2] && 'outlined'} onClick={() => handleClicked('width', 3)}>
        3
      </Button>

      <Typography>:גובה</Typography>
      <Button variant={clicked['height'][0] && 'outlined'} onClick={() => handleClicked('height', 1)}>
        1
      </Button>
      <Button variant={clicked['height'][1] && 'outlined'} onClick={() => handleClicked('height', 2)}>
        2
      </Button>
      <Button variant={clicked['height'][2] && 'outlined'} onClick={() => handleClicked('height', 3)}>
        3
      </Button>
      <Button
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
    </>
  )
}
export default CubeUi
