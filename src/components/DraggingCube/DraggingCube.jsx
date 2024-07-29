import React, { useState } from 'react'
import { useGLTF } from '@react-three/drei'

// this component display 3D dragging cube on the screen
const DraggingCube = ({ position, onDrag, url, size }) => {
  const { scene } = useGLTF(`cubes/${url}.gltf`)
  const [isDragging, setIsdragging] = useState(false)

  const startDrag = () => {
    setIsdragging(true)
  }
  const stopDrag = () => {
    setIsdragging(false)
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
      onPointerDown={startDrag}
      onPointerMissed={stopDrag}
      onPointerMove={movement}
      object={scene.clone(true)}
      scale={[1, 1, 0.84]}
      position={position}
      rotation-y={0}
    />
  )
}

export default DraggingCube
