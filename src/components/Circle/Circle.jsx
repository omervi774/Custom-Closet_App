import React, { useEffect, useState } from 'react'

export default function Circle({ position, cubeSize }) {
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight })

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

  let cubeMultificationFactorXAxis = 0
  let cubeMultificationFactorYAxis = 0
  if (cubeSize[0] === 1) {
    cubeMultificationFactorXAxis = 160
  } else if (cubeSize[0] === 2) {
    cubeMultificationFactorXAxis = 90
  } else {
    cubeMultificationFactorXAxis = 50
  }

  if (cubeSize[1] === 1) {
    cubeMultificationFactorYAxis = 110
  } else if (cubeSize[1] === 2) {
    cubeMultificationFactorYAxis = 50
  } else {
    cubeMultificationFactorYAxis = 30
  }

  // Calculate the position to center the circle within the screen
  const circleStyle = {
    height: '30px',
    width: '30px',
    backgroundColor: 'lightblue',
    borderRadius: '50%',
    position: 'absolute',
    left: `${screenSize.width / 2 + position[0] * 170 - (cubeSize[0] / 2) * cubeMultificationFactorXAxis + 70}px`, // Adjust for circle's half width
    top: `${screenSize.height / 2 - position[1] * 170 + cubeSize[1] * cubeMultificationFactorYAxis}px`, // Adjust for circle's half height

    transform: 'translate(-50%, -50%)', // Center the circle
  }

  return <div style={circleStyle} onClick={(e) => console.log(e)}></div>
}
