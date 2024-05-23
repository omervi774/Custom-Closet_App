import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const xOriginal = 5.023457765579224
//const xOriginal = 5.5
const yOriginal = 5.2985639572143555
const zOriginal = 2.800002098083496
//const zOriginal = 5
function TopCube({ position, size }) {
  const { scene } = useGLTF('topCube/cabbinet_from_top.gltf')
  const [xPosition, setXPosition] = useState(position[0])

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
    // if (position[0] < 0) {
    //   setXPosition(position[0] + (size[0] / 12.5 / 1.7) * Math.floor(position[0]))
    // } else if (position[0] > 0) {
    //   setXPosition(position[0] - (size[0] / 10 / 1.7) * Math.floor(position[0]))
    // }

    // Set the original size
  }, [scene, xPosition])

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, (2.800002098083496 / zOriginal) * 0.3]}
      position={[xPosition, position[1] - (size[1] / 7 / 1.7) * Math.floor(position[1]), position[2]]}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}
//- (size[1] / 7 / 1.7) * position[1]

export default TopCube
