import React from 'react'
import { useGLTF } from '@react-three/drei'
const offset = 0.04
export default function GlassShelf({ position, xSize }, ...props) {
  const { nodes, materials } = useGLTF('/glassShelf1/sheltglas.glb')
  let scale = []
  const addingPosition = []
  if (xSize === 1) {
    scale = [xSize / 5, 0.01, (1 / 2.9500019550323486) * 0.5]
    addingPosition[0] = position[0]
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  } else if (xSize === 2) {
    scale = [(xSize - offset) / 5, 0.01, (1 / 2.9500019550323486) * 0.5]
    addingPosition[0] = position[0] + 0.5 * offset
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  } else {
    scale = [(xSize - offset * 2) / 5, 0.01, (1 / 2.9500019550323486) * 0.5]
    addingPosition[0] = position[0] + offset
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  }

  return (
    <>
      <group {...props} dispose={null}>
        {/* <directionalLight intensity={3} position={[10, 10, 10]} /> */}

        <mesh
          // castShadow
          // receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials['Material.001']}
          scale={scale}
          position={addingPosition}
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
