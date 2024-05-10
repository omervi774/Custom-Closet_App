import React, { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, OrbitControls, Environment } from '@react-three/drei'
import { MenuItem, Paper, MenuList, Box } from '@mui/material'
import DraggingCube from '../components/DraggingCube/DraggingCube'
import Cube from '../components/Cube/Cube'
import Circle from '../components/Circle/Circle'
import GlassShelf from '../components/glassShelf/GlassShelf'
import CubeUi from '../components/CubeUi/CubeUi'
import ShelfUi from '../components/ShelfUi/ShelfUi'
import ModalMessage from '../components/ModalMessage/ModalMessage'
//import * as THREE from 'three'
//const lastConnections = []
export default function ClosetDesign() {
  // for the dragging cube
  const [position, setPosition] = useState([-2, 2, 0])
  // this state responssible to store the possitions and sizes of all the cubes
  const [cubes, setCubes] = useState({
    0: [{ position: [0, 0, 0], size: [1, 1], display: true }],
  })

  // this state responssible to check if the user try to drag new cube or not
  const [isDragging, setIsDragging] = useState(false)

  // this state responssible to check if the user try to add new drawer or not
  const [addDrawer, setAddDrawer] = useState(false)

  const [isMenu, setIsMenu] = useState(true)

  // this state responssible to open/close the main menu
  const [isFirstOpen, setFirstOpen] = useState(true)

  // this state responssible to open/close the secondary menu
  const [isSecondaryOpen, setSecondaryOpen] = useState([false, undefined])

  const [size, setSize] = useState([1, 1])

  // this state responssible to notify the user whether he made valid or invalid cube connection
  const [message, setMessage] = useState(undefined)

  const orbitControlsRef = useRef()

  const handleResetRotation = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset() // Reset rotation
    }
  }

  // const [lastConnections, setLastConnections] = useState([])

  const addingCubeToSide = (layer, positionToAddYAxis, cubeSize, xPosition, side) => {
    for (let i = 0; i < cubeSize[1]; i++) {
      const yPosition = i === 0 ? Number(layer) + positionToAddYAxis : i + Number(layer)
      const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
      const display = i === 0 ? true : false
      const updatingLayerArr = cubes[Number(layer) + i]
        ? side === 'left'
          ? [
              { position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display },
              ...cubes[Number(layer) + i],
            ]
          : [
              ...cubes[Number(layer) + i],
              { position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display },
            ]
        : [{ position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display }]
      handleAddingCube(Number(layer) + i, updatingLayerArr)
    }
    // setLastConnections((prev) => {
    //   return [...prev, { position: [xPosition, Number(layer) + positionToAddYAxis, 0], size: cubeSize }]
    // })

    // console.log(lastConnections)
    setIsDragging(false)
    setPosition([-2, 2, 0])
  }

  // this function return true if there is enough room for the cube (x-axis)
  // and also return the position of the x to the new cube
  const is_include = (cube, xSize, layer) => {
    let include = false
    let sizeSum = 0
    let xPosition = 0 // if there is connection' this val store the position on the x axis of the new cube
    const epsilon = 0.1
    for (let index = 0; index < cubes[layer].length; index++) {
      const val = cubes[layer][index]
      //checks if the left edge of the upper cube is equal to the left edge of the cube bellow
      if (Math.abs(val.position[0] - val.size[0] / 2 - (cube[0] - xSize / 2)) < epsilon) {
        let sum = 0
        for (let i = index; i < cubes[layer].length; i++) {
          sum += cubes[layer][i].size[0]
          if (sum >= xSize) {
            include = true
            xPosition = val.position[0] - val.size[0] / 2 + xSize / 2
            return [include, xPosition]
          }
        }
        return [false, -3]
      }
      //checks if the right edge of the upper cube is equal to the right edge of the cube bellow
      if (Math.abs(val.position[0] + val.size[0] / 2 - (cube[0] + xSize / 2)) < epsilon) {
        if (sizeSum + val.size[0] >= xSize) {
          include = true
          xPosition = val.position[0] + val.size[0] / 2 - xSize / 2
          return [include, xPosition]
        }
        return [false, -3]
      } else {
        sizeSum += val.size[0]
      }
    }
    return [false, xPosition]
  }
  // checks if the position of the new cube does not override other cubes of the layer
  const isEnoughRoom = (layer, xPositionOfNewCube, cubeSize) => {
    let overRide = false
    const cubeLeftEdge = xPositionOfNewCube - cubeSize[0] / 2
    const cubeRightEdge = xPositionOfNewCube + cubeSize[0] / 2
    if (cubes[layer]) {
      cubes[layer].forEach((cube) => {
        // checks if the new cube edges is between one of the cubes in the layer, in other words override the cube position
        if (
          (cubeLeftEdge > cube.position[0] - cube.size[0] / 2 && cubeLeftEdge < cube.position[0] + cube.size[0] / 2) ||
          (cubeRightEdge > cube.position[0] - cube.size[0] / 2 && cubeRightEdge < cube.position[0] + cube.size[0] / 2)
        ) {
          overRide = true
          //return
        }
      })
    }
    return overRide
  }
  // gets the layaer to update and the updating array of the layer and update the states of the cubes
  const handleAddingCube = (layer, updatingLayerArr) => {
    setCubes((prev) => {
      console.log({ ...prev, [layer]: updatingLayerArr })
      console.log(layer)
      return {
        ...prev,
        [layer]: updatingLayerArr,
      }
    })
    setMessage('success')
    // setIsMenu(true)
  }
  const closeModalMessage = () => {
    setMessage(undefined)
    setIsMenu(true)
  }
  // in case the cube is connecting from the top need to find its place in the sorted array of the layer + size
  const findCubeRoom = (layer, val) => {
    // in case the cube is the first element in the layer
    if (!cubes[layer]) {
      return -1
    }
    let start = 0
    let end = cubes[layer].length - 1

    do {
      let mid = Math.floor((end + start) / 2)
      let xPosition = cubes[layer][mid].position[0]
      if (xPosition > val) {
        end = mid - 1
      } else if (xPosition < val) {
        start = mid + 1
      } else {
        // in case there is existing cube at the requierd position
        return -2
      }
    } while (start <= end)

    return start // the position that needs to place the new cube
  }
  const handleDrag = (newPosition, cubeSize) => {
    setPosition(newPosition)
    const epsilon = 0.2
    const size = 1
    //for each key of our layers check if the dragging cube connects to the layer from the left/right
    Object.keys(cubes).forEach((layer) => {
      const leftEdge = cubes[layer][0].position[0] - cubes[layer][0].size[0] / 2 // left edge of the layer
      const rightEdge =
        cubes[layer][cubes[layer].length - 1].position[0] + cubes[layer][cubes[layer].length - 1].size[0] / 2 // right edge of the layer
      let positionToAddYAxis = 0
      if (cubeSize[1] === 2) {
        positionToAddYAxis = 0.5
      } else if (cubeSize[1] === 3) {
        positionToAddYAxis = 1
      }

      // check if the dragging cube is in the same height of the layer
      if (Math.abs(newPosition[1] - Number(layer)) < epsilon + positionToAddYAxis) {
        const isLayer0 = Number(layer) === 0

        // check if the dragging cube is connecting from the left
        if (Math.abs(newPosition[0] + cubeSize[0] / 2 - leftEdge) < epsilon) {
          if (isLayer0) {
            addingCubeToSide(layer, positionToAddYAxis, cubeSize, leftEdge - cubeSize[0] / 2, 'left')
            console.log('left')
            return
          } else {
            // in case try adding cube to layers thats requires cube bellow
            const [containsButtomCube] = is_include(
              [leftEdge - cubeSize[0] / 2, Number(layer) - size, 0],
              cubeSize[0],
              layer - size
            )
            if (containsButtomCube) {
              addingCubeToSide(layer, positionToAddYAxis, cubeSize, leftEdge - cubeSize[0] / 2, 'left')
              console.log('left')
              return
            }
          }
          // check if the dragging cube is connecting from the right
        } else if (Math.abs(newPosition[0] - cubeSize[0] / 2 - rightEdge) < epsilon) {
          if (isLayer0) {
            addingCubeToSide(layer, positionToAddYAxis, cubeSize, rightEdge + cubeSize[0] / 2, 'right')
            console.log('right')
            return
          } else {
            // in case try adding cube to layers thats requires cube bellow
            const [containsButtomCube] = is_include(
              [rightEdge + size, Number(layer) - size, 0],
              cubeSize[0],
              layer - size
            )

            if (containsButtomCube) {
              addingCubeToSide(layer, positionToAddYAxis, cubeSize, rightEdge + cubeSize[0] / 2, 'right')
              console.log('right')
              return
            }
          }
        }
      }
      // check if the dragging cube connects from the top
      else if (Math.abs(newPosition[1] - (Number(layer) + size)) < epsilon + positionToAddYAxis) {
        // check if there is a cube to connect to
        const [containsButtomCube, x] = is_include([newPosition[0], Number(layer), 0], cubeSize[0], layer)
        // check if the new cube position has enough room on the new layer
        const isOverRide = isEnoughRoom(Number(layer) + 1, x, cubeSize)
        if (isOverRide && containsButtomCube) {
          setMessage('error')
          console.log('omer hamelech')
        }
        if (containsButtomCube && !isOverRide) {
          let i
          for (i = 0; i < cubeSize[1]; i++) {
            const indexToInsert = findCubeRoom(`${Number(layer) + i + size}`, x)
            const yPosition = i === 0 ? 1 + Number(layer) + positionToAddYAxis : 1 + i + Number(layer)
            const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
            const display = i === 0 ? true : false
            if (indexToInsert === -1) {
              // in case the layer in new
              handleAddingCube(`${Number(layer) + i + size}`, [
                { position: [x, yPosition, 0], size: cubeAddingSize, display: display },
              ])
            } else if (indexToInsert === -2) {
              setMessage('error')
              // in case there is already cube in the requierd position
              break
              //return
            } else {
              // in case the new cube is should be at the end of the layer
              if (indexToInsert >= cubes[`${Number(layer) + i + size}`].length) {
                handleAddingCube(`${Number(layer) + i + size}`, [
                  ...cubes[`${Number(layer) + i + size}`],
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display },
                ])
                // in case the new cube should be place at the start of the new layer
              } else if (indexToInsert <= 0) {
                handleAddingCube(`${Number(layer) + i + size}`, [
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display },
                  ...cubes[`${Number(layer) + i + size}`],
                ])
              } else {
                // in case the cube should be place somewhere at the midelle of the layer
                handleAddingCube(`${Number(layer) + i + size}`, [
                  ...cubes[`${Number(layer) + i + size}`].slice(0, indexToInsert),
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display },
                  ...cubes[`${Number(layer) + i + size}`].slice(
                    indexToInsert,
                    cubes[`${Number(layer) + i + size}`].length
                  ),
                ])
              }
            }
          }
          if (i > 0) {
            // setLastConnections((prev) => {
            //   return [...prev, { position: [x, 1 + Number(layer) + positionToAddYAxis, 0], size: cubeSize }]
            // })
            // console.log(lastConnections)
            console.log('top')
          }
          setIsDragging(false)
          setPosition([-2, 2, 0])
          return
        }
      }
    })
  }
  // after the user chose size of the dragging cube set its width and height and close the menu
  const newDraggingCube = (width, height) => {
    setSize([width, height])
    setIsDragging(true)
    setIsMenu(false)
    setFirstOpen(true)
    setSecondaryOpen([false, undefined])
  }
  const addNewShelf = (material) => {
    console.log(material)
    setIsMenu(false)
    setFirstOpen(true)
    setSecondaryOpen([false, undefined])
    setAddDrawer(!addDrawer)
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '10vh', zIndex: 1000 }}>
        {/* menu container */}
        <Paper sx={{ height: '90vh', width: '15vh', display: !isMenu && 'none' }}>
          {/* first menu - let the use the option to add new cube or shelf */}
          <MenuList>
            <MenuItem
              sx={{ color: 'black', display: !isFirstOpen && 'none' }}
              onClick={() => {
                setFirstOpen(false)
                setSecondaryOpen([true, 'קוביות'])
                handleResetRotation()
              }}
            >
              קוביות
            </MenuItem>
            <MenuItem
              sx={{ color: 'black', display: !isFirstOpen && 'none' }}
              onClick={() => {
                setFirstOpen(false)
                setSecondaryOpen([true, 'מגירות'])
                handleResetRotation()
              }}
            >
              מגירות
            </MenuItem>
          </MenuList>
          {/* second menu item - display the user the cubes size and let him choose the requiered size */}
          <MenuItem
            sx={{ color: 'black', display: isSecondaryOpen[0] && isSecondaryOpen[1] === 'קוביות' ? true : 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CubeUi title="קוביות" newDraggingCube={newDraggingCube} />
            </Box>
          </MenuItem>
          {isSecondaryOpen[0] && isSecondaryOpen[1] === 'מגירות' && (
            <ShelfUi title={'מגירות'} addNewShelf={addNewShelf} />
          )}
        </Paper>
      </div>

      {/* <Button
        color="success"
        variant="contained"
        onClick={() => {
          setIsDragging(true)
        }}
        sx={{ color: 'white' }}
      >
        הוסף קובייה
      </Button> */}
      {/* <Button
        color="success"
        variant="contained"
        onClick={() => {
          //in case there is dragging cube that awaits to connect
          if (isDragging) {
            setIsDragging(false)
            setPosition([-2, 2, 0])
            return
          }
          // in case there is no connections
          // if (!lastConnections.length) {
          //   return
          // }

          // const valToRemove = lastConnections.pop() // the position+size of the last connection
          // console.log(lastConnections)

          // let layer = valToRemove.position[1]
          // if (valToRemove.size[1] === 2) {
          //   layer -= 0.5
          // } else if (valToRemove.size[1] === 3) {
          //   layer -= 1
          // }
          // console.log(layer)
          // for (let i = 0; i < valToRemove.size[1]; i++) {
          //   // remove the element from the layer
          //   const removeLastElement = cubes[`${layer + i}`].filter((val) => {
          //     return val.position[0] !== valToRemove.position[0]
          //   })

          //   setCubes((prev) => {
          //     if (!removeLastElement || removeLastElement.length === 0) {
          //       // If removeLastElement is empty, delete the layer property
          //       const { [layer + i]: omit, ...newState } = prev
          //       return newState
          //     }
          //     return {
          //       ...prev,
          //       [`${layer + i}`]: removeLastElement,
          //     }
          //   })
          // }
        }}
        sx={{ color: 'white' }}
      >
        בטל פעולה{' '}
      </Button> */}
      {/* <Button color="success" variant="contained" sx={{ color: 'white' }} onClick={() => setAddDrawer(!addDrawer)}>
        הוסף מגירה
      </Button> */}
      {message && <ModalMessage typeOfMessage={message} onCloseModal={closeModalMessage} />}
      <Canvas
        shadows
        //frameloop="always"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        {/* <directionalLight color="white" intensity={0.5} /> */}
        <Suspense fallback={null}>
          {!isDragging && isSecondaryOpen[1] === undefined && (
            <OrbitControls
              ref={orbitControlsRef}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          {Object.keys(cubes).map((key) =>
            cubes[key].map(
              (cube, index) => cube.display && <Cube key={index} position={cube.position} size={cube.size} />
            )
          )}

          {isDragging && <DraggingCube position={position} onDrag={handleDrag} size={size} />}
          {/* <GlassShelf /> */}
          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
      {Object.keys(cubes).map((key) =>
        cubes[key].map(
          (cube, index) =>
            cube.display && addDrawer && <Circle key={index} position={cube.position} cubeSize={cube.size} />
        )
      )}
    </>
  )
}
