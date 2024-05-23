import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const xOriginal = 5.023457765579224
const yOriginal = 5.2985639572143555
const zOriginal = 2.800002098083496
function NoButtomNoLeft({ position, size }) {
  const { scene } = useGLTF('noButtomNoLeftCube/cabbinet_no_buttom_no_left_new.gltf')
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
      position={[position[0], position[1] - (size[1] / 7 / 1.7) * Math.floor(position[1]), position[2]]}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default NoButtomNoLeft
