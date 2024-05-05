import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function GlassShelf(props) {
  const { nodes, materials } = useGLTF('/glassShelf1/sheltglas.glb')

  return (
    <>
      <group {...props} dispose={null}>
        {/* <directionalLight intensity={3} position={[10, 10, 10]} /> */}

        <mesh
          // castShadow
          // receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials['Material.001']}
          scale={[0.4, 0.01, (1 / 2.9500019550323486) * 0.5]}
          position={[-0.5, 1.5, 0]}
        >
          {/* <Decal scale={[1, 1, 1]} position={[0, 0.45, 0]} /> */}
        </mesh>
      </group>
    </>
  )
}

// Preload the GLTF file before rendering the component
GlassShelf.preload = () => {
  return useGLTF.preload('/glassShelf1/sheltglas.glb')
}
