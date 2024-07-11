import React, { useState, Suspense } from 'react'
import useData from '../useData'
import { Preload, OrbitControls, Environment } from '@react-three/drei'
import { Shelf } from '../components/Shelf/Shelf.jsx'
import { Canvas } from '@react-three/fiber'
import Cube from '../components/Cube/Cube'
import Arrow from '../components/Arrow/Arrow'
import { Button, Typography, Box, Modal } from '@mui/material'
import { serverRoute } from '../components/consts/consts.js'
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
const titleStyle = {
  direction: 'rtl',
  textAlign: 'right',
}
function Orders() {
  const [detailsModal, setDetailsModal] = useData(false)
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
      {ordersData.length > 0 && ordersData[orderIndex].cubes !== undefined && (
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
      )}
      {ordersData.length > 0 && ordersData[orderIndex].path && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <img
            src={ordersData[orderIndex].path}
            alt="Placeholder"
            style={{
              paddingRight: 150,
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '5px',
            }}
          />
        </div>
      )}
      {ordersData.length > 0 && (
        <>
          <Button sx={{ position: 'absolute', left: '40%', top: '80%' }} variant="contained" onClick={() => setDetailsModal(true)}>
            {' '}
            ראה פרטיי תקשורת
          </Button>
          <Button sx={{ position: 'absolute', left: '40%', top: '86.5%' }} variant="contained" onClick={deleteOrder}>
            {' '}
            הסר הזמנה מהזמנות פעיולות
          </Button>
          <Arrow leftPosition={50} arrowType="forward" handleClick={handleForwardClick} />
          <Arrow leftPosition={40} arrowType="backward" handleClick={handleBackwardClick} />
        </>
      )}
      {ordersData.length > 0 && (
        <Modal open={detailsModal} onClose={() => setDetailsModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2" sx={titleStyle}>
              פרטי תקשורת
            </Typography>
            <Typography variant="h6" component="h2" sx={titleStyle}>
              שם : {ordersData[orderIndex].userDetails['name']}
            </Typography>

            <Typography variant="h6" component="h2" sx={titleStyle}>
              כתובת : {ordersData[orderIndex].userDetails['address']}
            </Typography>

            <Typography variant="h6" component="h2" sx={titleStyle}>
              עיר : {ordersData[orderIndex].userDetails['city']}
            </Typography>

            <Typography variant="h6" component="h2" sx={titleStyle}>
              מייל : {ordersData[orderIndex].userDetails['email']}
            </Typography>

            <Typography variant="h6" component="h2" sx={titleStyle}>
              מספר טלפון : {ordersData[orderIndex].userDetails['phone']}
            </Typography>
          </Box>
        </Modal>
      )}
    </>
  )
}

export default Orders
