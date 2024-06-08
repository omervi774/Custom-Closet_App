import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const AnimatedArrow = () => {
  return (
    <ArrowBackIcon
      fontSize="large"
      style={{
        position: 'absolute',
        top: '17%',
        left: '15%',
        transform: 'scaleX(3)',
        animation: 'moveArrow 1s infinite',
      }}
    />
  )
}

// Define the keyframes for the animation
const styles = `
@keyframes moveArrow {
  0% {
    transform: translateX(0) scaleX(3);
  }
  50% {
    transform: translateX(10px) scaleX(3); /* Adjust distance as needed */
  }
  100% {
    transform: translateX(0) scaleX(3);
  }
}`

// Inject the keyframes into the document
const styleSheet = document.createElement('style')
styleSheet.type = 'text/css'
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

export default AnimatedArrow
