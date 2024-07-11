import React, { useState, useEffect } from 'react'

const TextSwap = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSwapping, setIsSwapping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSwapping(true)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          return (prevIndex + 1) % 4
        })

        setIsSwapping(false)
      }, 2500) // match with the duration of the animation
    }, 4000)

    return () => clearInterval(interval)
  }, [data.length])

  return (
    <div style={{ backgroundColor: '#d3d3d3', padding: '40px 0' }}>
      <div
        style={{
          maxWidth: '1200px',
          //height: '0.5%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className={`slide ${isSwapping ? 'out' : 'in'}`}>
          {/* <h1 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '20px' }}>{data[currentIndex].title}</h1> */}
          <p style={{ textAlign: 'center', fontSize: '18px', color: 'black', marginBottom: '20px' }}>{data[currentIndex].subTitle}</p>
        </div>
      </div>
    </div>
  )
}

export default TextSwap
