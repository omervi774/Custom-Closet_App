import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const xOriginal = 5
const yOriginal = 4.733231484369091
const zOriginal = 5.000000000000018
function OnlyTopCube({ position, size }) {
  const { scene } = useGLTF('justTop/cabbinetfromallsides.gltf')
  //const [xPosition, setXPosition] = useState(position[0])

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

    // Set the original size
  }, [scene])

  return (
    <primitive
      object={scene.clone(true)}
      scale={[size[0] / xOriginal, size[1] / yOriginal, (2.800002098083496 / zOriginal) * 0.3]}
      position={position}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default OnlyTopCube
