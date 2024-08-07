import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const AnimatedArrow = () => {
  return (
    <ArrowForwardIcon
      fontSize="large"
      style={{
        position: 'absolute',
        top: '19%',
        right: '15%',
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
