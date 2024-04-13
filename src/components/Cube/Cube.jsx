import React from 'react'
import { useGLTF } from '@react-three/drei'
const yOriginal = 2.2274539470672607
const xOriginal = 2
const Cube = ({ position, size }) => {
  const { scene } = useGLTF('cube/cabbinet.gltf')

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, 0.5]}
      position={position}
      rotation-y={0}
    />
  )
}

export default Cube
