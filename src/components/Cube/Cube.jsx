import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const Cube = ({ position, url }) => {
  // const { scene } = useGLTF(`cubes/${url}.gltf`)
  const { scene } = useGLTF(`cubes/${url}.gltf`)
  useEffect(() => {
    // Clone the scene toRight avoid modifying the original
    const clonedScene = scene.clone(true)

    // Compute the bounding box
    const box = new THREE.Box3().setFromObject(clonedScene)

    // Calculate the size
    const boxSize = box.getSize(new THREE.Vector3())
    console.log(boxSize.x)
    console.log(boxSize.y)
    console.log(boxSize.z)
  }, [scene])

  return (
    <primitive
      object={scene.clone(true)}
      scale={[1, 1, 0.84]}
      position={position}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default Cube
