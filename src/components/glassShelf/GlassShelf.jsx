import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function GlassShelf({ position, xSize }, ...props) {
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
          scale={[xSize / 5, 0.1, (1 / 2.9500019550323486) * 0.5]}
          position={position}
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
