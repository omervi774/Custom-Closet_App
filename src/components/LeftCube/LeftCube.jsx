import React, { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const xOriginal = 5.005848129603507
const yOriginal = 5.2985639572143555
const zOriginal = 5.000000437625104
function LeftCube({ position, size }) {
  const { scene } = useGLTF('leftCube/cabbinetfromleft.gltf')

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, (2.800002098083496 / zOriginal) * 0.3]}
      position={[position[0], position[1], position[2]]}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default LeftCube
