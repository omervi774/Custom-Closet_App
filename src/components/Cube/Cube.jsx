import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const offset = 0.04

const Cube = ({ position, url }) => {
  // const { scene } = useGLTF(`cubes/${url}.gltf`)
  const { scene } = useGLTF(`cubes/${url}.gltf`)
  let scale = []
  let possitionOffset = []
  switch (url) {
    case '1X1':
      scale = [1, 1, 0.84]
      possitionOffset = position
      break
    case '1X2':
      scale = [1, (2 - offset) / 2, 0.84]
      possitionOffset = [position[0], position[1] - offset / 2, 0]
      break
    case '1X3':
      scale = [1, (3 - 2 * offset) / 3, 0.84]
      possitionOffset = [position[0], position[1] - offset, 0]
      break
    case '2X1':
      scale = [(2 - offset) / 2, 1, 0.84]
      possitionOffset = [position[0] + offset / 2, position[1], 0]
      break
    case '2X2':
      scale = [(2 - offset) / 2, (2 - offset) / 2, 0.84]
      possitionOffset = [position[0] + offset / 2, position[1] - offset / 2, 0]
      break
    case '2X3':
      scale = [(2 - offset) / 2, (3 - 2 * offset) / 3, 0.84]
      possitionOffset = [position[0] + offset / 2, position[1] - offset, 0]
      break
    case '3X1':
      scale = [(3 - offset * 2) / 3, 1, 0.84]
      possitionOffset = [position[0] + offset, position[1], 0]
      break
    case '3X2':
      scale = [(3 - offset * 2) / 3, (2 - offset) / 2, 0.84]
      possitionOffset = [position[0] + offset, position[1] - offset / 2, 0]
      break
    case '3X3':
      scale = [(3 - offset * 2) / 3, (3 - 2 * offset) / 3, 0.84]
      possitionOffset = [position[0] + offset, position[1] - offset, 0]
      break
    default:
      scale = [1, 1, 1]
      possitionOffset = [0, 0, 0]
      break
  }

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
      scale={scale}
      position={possitionOffset}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default Cube
