import React, { useState, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const DraggingCube = ({ position, onDrag, url, size }) => {
  const { scene } = useGLTF(`cubes/${url}.gltf`)
  const [isDragging, setIsDragging] = useState(false)
  const timerRef = useRef(null)

  const startLongPress = () => {
    timerRef.current = setTimeout(() => {
      setIsDragging(true)
    }, 500) // 500ms for a long press
  }

  const stopLongPress = () => {
    clearTimeout(timerRef.current)
    setIsDragging(false)
  }

  const movement = (e) => {
    if (!isDragging) {
      return
    }

    const { movementX, movementY } = e

    console.log(position[0] + movementX * 0.03)
    console.log(position[1] - movementY * 0.03)
    onDrag([position[0] + movementX * 0.03, position[1] - movementY * 0.03, 0], size)
  }

  return (
    <primitive
      onPointerDown={startLongPress}
      onPointerUp={stopLongPress}
      onPointerMove={movement}
      object={scene.clone(true)}
      scale={[1, 1, 0.84]}
      position={position}
      rotation-y={0}
    />
  )
}

export default DraggingCube
