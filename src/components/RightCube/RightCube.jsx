import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const xOriginal = 5.005847692489624
const yOriginal = 5.298563957214375
const zOriginal = 5.00000000000002

function RightCube({ position, size }) {
  const { scene } = useGLTF('rightCube/cabbinet_from_right.gltf')
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
  }, [scene])

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, (2.800002098083496 / zOriginal) * 0.3]}
      position={[position[0], position[1], position[2]]}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}
//- (size[0] / 10 / 1.7) * Math.floor(position[0]),

export default RightCube
