import React from 'react'
import { useGLTF } from '@react-three/drei'

const xOriginal = 5
const yOriginal = 5
const Cube = ({ position, size }) => {
  const { scene } = useGLTF('nolegCube/cabbinetnolegs.gltf')

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, 0.3]}
      position={position}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default Cube
