import { useTheme } from '@emotion/react'
import React, { useEffect, useState } from 'react'

export default function Circle({ position, cubeSize, place, handleAddingShelf }) {
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const theme = useTheme()

  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
      console.log(window.innerWidth)
      console.log(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //let cubeMultificationFactorXAxis = 0
  let cubeMultificationFactorYAxis = 0
  let cubeMultificationFactorXAxis = 0
  // if (cubeSize[0] === 1) {
  //   cubeMultificationFactorXAxis = 140
  // } else if (cubeSize[0] === 2) {
  //   cubeMultificationFactorXAxis = 55
  // } else {
  //   cubeMultificationFactorXAxis = 65
  // }

  if (cubeSize[1] === 1) {
    cubeMultificationFactorYAxis = 70
  } else if (cubeSize[1] === 2) {
    cubeMultificationFactorYAxis = 30
  } else {
    cubeMultificationFactorYAxis = 20
  }
  if (position[0] > 0) {
    cubeMultificationFactorXAxis = 87
  } else {
    cubeMultificationFactorXAxis = 93
  }

  // Calculate the position to center the circle within the screen
  const circleStyle = {
    height: '30px',
    width: '30px',
    backgroundColor: theme.palette.background.default,
    borderRadius: '50%',
    position: 'absolute',
    left: `${screenSize.width / 2 + (position[0] + 0.000001) * cubeMultificationFactorXAxis}px`, // Adjust for circle's half width    - (cubeSize[0] / 2) * cubeMultificationFactorXAxis + 65
    top: `${screenSize.height / 2 - position[1] * 85 + cubeSize[1] * cubeMultificationFactorYAxis}px`, // Adjust for circle's half height

    transform: 'translate(-50%, -50%)', // Center the circle
  }
  const handleClick = () => {
    const edge = place === 'top' ? position[1] + cubeSize[1] / 2 : position[1] - cubeSize[1] / 2

    handleAddingShelf(position[0], edge, cubeSize[0])
  }

  return (
    <div style={circleStyle}>
      <div
        onClick={handleClick}
        style={{
          height: '15px',
          width: '15px',
          borderRadius: '50%',
          backgroundColor: 'white',
          position: 'absolute',
          left: '7.5px',
          top: '7.5px',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}
