import React, { useState } from 'react'
import { useGLTF } from '@react-three/drei'

const xOriginal = 5
const yOriginal = 5.2985639572143555
// this component display 3D dragging cube on the screen
const DraggingCube = ({ position, onDrag, size }) => {
  const { scene } = useGLTF('nolegCube/cabbinetnolegs.gltf')
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

    console.log(position[0] + movementX * 0.02)
    console.log(position[1] - movementY * 0.02)
    onDrag([position[0] + movementX * 0.015, position[1] - movementY * 0.015, 0], size)
  }

  return (
    <primitive
      onPointerDown={startDrag}
      onPointerMissed={stopDrag}
      onPointerMove={movement}
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, 0.3]}
      position={position}
      rotation-y={0}
    />
  )
}

export default DraggingCube
