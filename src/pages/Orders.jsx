import React, { useState, Suspense } from 'react'
import useData from '../useData'
import { Preload, OrbitControls, Environment } from '@react-three/drei'
import { Shelf } from '../components/Shelf/Shelf.jsx'
import { Canvas } from '@react-three/fiber'
import Cube from '../components/Cube/Cube'
import Arrow from '../components/Arrow/Arrow'
import { Button } from '@mui/material'
import { serverRoute } from '../components/consts/consts.js'
function Orders() {
  const [ordersData, setOrdersData] = useData(`${serverRoute}/orders`)
  const [orderIndex, setOrderIndex] = useState(0)
  const handleForwardClick = () => {
    setOrderIndex((orderIndex + 1) % ordersData.length)
  }
  const handleBackwardClick = () => {
    setOrderIndex((prev) => {
      if (prev === 0 && ordersData.length > 1) {
        return ordersData.length - 1
      } else if (ordersData.length === 0 || ordersData.length === 1) {
        return 0
      }

      return prev - 1
    })
  }
  const deleteOrder = async () => {
    console.log(ordersData[orderIndex].id)
    const id = ordersData[orderIndex].id
    await fetch(`${serverRoute}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setOrdersData(
      ordersData.filter((order) => {
        return order.id !== id
      })
    )
    if (orderIndex !== 0) {
      setOrderIndex(orderIndex - 1)
    }
  }
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        <Environment preset="city" />

        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI} minPolarAngle={Math.PI / 2} />
          {ordersData.length > 0 &&
            Object.keys(ordersData[orderIndex].cubes).map((key) =>
              ordersData[orderIndex].cubes[key].map(
                (cube, index) =>
                  cube.display && (
                    <Cube
                      key={index}
                      position={[cube.position[0] + cube.offset[0], cube.position[1] - cube.offset[1], 0]}
                      url={`${cube.size[0]}X${cube.size[1]}`}
                    />
                  )
              )
            )}
          {ordersData.length > 0 &&
            ordersData[orderIndex].shelfs.map((shelf, index) => {
              return <Shelf key={index} position={shelf.position} xSize={shelf.xSize} url={shelf.shelfColor} />
            })}

          <Preload all />
        </Suspense>
      </Canvas>
      {ordersData.length > 0 && (
        <>
          <Button sx={{ position: 'absolute', left: '40%', top: '80%' }} variant="contained" onClick={deleteOrder}>
            {' '}
            הסר הזמנה מהזמנות פעיולות
          </Button>
          <Arrow leftPosition={50} arrowType="forward" handleClick={handleForwardClick} />
          <Arrow leftPosition={40} arrowType="backward" handleClick={handleBackwardClick} />
        </>
      )}
    </>
  )
}

export default Orders
