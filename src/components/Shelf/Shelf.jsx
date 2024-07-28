// import React from 'react'
// import { useGLTF } from '@react-three/drei'
import React from 'react'
import { useGLTF } from '@react-three/drei'

const offset = 0.04
export function Shelf({ position, xSize, url }, ...props) {
  const { nodes, materials } = useGLTF(`shelfs/${url}.glb`)

  let scale = []
  const addingPosition = []
  if (xSize === 1) {
    scale = [xSize / 2.2, 0.005, 0.4]
    addingPosition[0] = position[0]
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  } else if (xSize === 2) {
    scale = [(xSize - offset) / 2.1, 0.005, 0.4]
    addingPosition[0] = position[0] + 0.5 * offset
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  } else {
    scale = [(xSize - offset * 2) / 2.1, 0.005, 0.4]
    addingPosition[0] = position[0] + offset
    addingPosition[1] = position[1]
    addingPosition[2] = 0
  }
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={materials['Material.001']}
        scale={scale}
        position={addingPosition}
      />
    </group>
  )
}

useGLTF.preload('/shletglass.glb')
