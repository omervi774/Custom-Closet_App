import React from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function GlassShelf() {
  const { scene } = useGLTF('glassShelf/sheltglass.gltf')

  //   console.log('Bounding Box Size:', boundingBox.getSize(new THREE.Vector3()))

  return (
    <group>
      <primitive
        object={scene.clone(true)}
        scale={[0.2, 0.9, (1 / 2.9500019550323486) * 0.5]}
        position={[0, 0.45, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}
