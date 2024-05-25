import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function MetalShelf() {
  const { scene } = useGLTF('woodShelf/sheltwood[1].gltf')
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
      scale={[0.2, 0.1, (1 / 2.9500019550323486) * 0.8]}
      position={[-2, 0, 0]}
      rotation-y={0} // Note: Should be 'rotationY' instead of 'rotation-y'
    />
  )
}

export default MetalShelf
