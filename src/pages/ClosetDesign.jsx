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
import Modal from '../components/Modal'
//import * as THREE from 'three'
//const lastConnections = []
export default function ClosetDesign() {
  // for the dragging cube
  const [position, setPosition] = useState([-2, 2, 0])
  // this state responssible to store the possitions and sizes of all the cubes
  const [cubes, setCubes] = useState({
    0: [{ position: [0, 0, 0], size: [1, 1], display: true }],
  })
  // Popup modal when the use first enter the page for basic explanation about the essence of the page
  const [isModalOpen, setIsModalOpen] = useState(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const [joins, setJoins] = useState({ join3Exists: 8, join4Exists: 0, join5Exists: 0 })
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
  const addingCubeToSide = (layer, positionToAddYAxis, cubeSize, xPosition, side) => {
    layer = Number(layer)
    const isLayer0 = layer === 0 ? true : false
    let oppositeSide
    let edge
    const leftSide = xPosition - cubeSize[0] / 2
    const rightSide = xPosition + cubeSize[0] / 2
    let isCubeFromSide // checks if in the layer bellow there is a cube that its edge oppsite edge match the new cube edge
    if (side === 'left') {
      edge = rightSide
      oppositeSide = 'right'
      isCubeFromSide = findCube(Number(layer) - 1, leftSide, 'right')
    } else {
      edge = leftSide
      oppositeSide = 'left'
      isCubeFromSide = findCube(Number(layer) - 1, rightSide, 'left')
    }
    const newCube = { position: [xPosition, Number(layer) + positionToAddYAxis], size: cubeSize }
    // checks the ratio between top edge of the new cube to the cube top edge connected cube
    const answear = calculateCubeConnectionRatio(newCube, Number(layer) - 1, edge, oppositeSide)
    console.log('answear is :', answear)
    if (isLayer0) {
      // in case top edges of the new cube and connected cube are equal
      if (answear === 'equal') {
        setJoins((prev) => {
          console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
          return { ...prev, join4Exists: prev.join4Exists + 4 }
        })
      }
      // in case top edges of the new cube and connected cube are equal and also there is a cube above the connected cube
      else if (answear === 'equal and cube above') {
        setJoins((prev) => {
          console.log({ ...prev, join3Exists: prev.join3Exists + 2, join5Exists: prev.join5Exists + 2 })
          return { ...prev, join3Exists: prev.join3Exists + 2, join5Exists: prev.join5Exists + 2 }
        })
      }
      // in case the new cube higher or lower the update of joins is the same
      else {
        setJoins((prev) => {
          console.log({ ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists + 2 })
          return { ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists + 2 }
        })
      }
    }

    for (let i = 0; i < cubeSize[1]; i++) {
      const yPosition = i === 0 ? Number(layer) + positionToAddYAxis : i + Number(layer)
      const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
      const display = i === 0 ? true : false

      let updatingLayerArr
      // in case the layer exists add the cube to the start or the end of the layer (depending on if the connection is from the left or right)
      if (cubes[Number(layer) + i]) {
        // in case the connection is from the left adding the new cube to the start of the layer
        if (side === 'left') {
          updatingLayerArr = [{ position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display }, ...cubes[Number(layer) + i]]
          // in case the connection is from the right adding the cube to the right of the layer
        } else {
          updatingLayerArr = [...cubes[Number(layer) + i], { position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display }]
        }
        // in case there is no layer open new one
      } else {
        updatingLayerArr = [{ position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display }]
      }
      handleAddingCube(Number(layer) + i, updatingLayerArr)
    }

    // setLastConnections((prev) => {
    //   return [...prev, { position: [xPosition, Number(layer) + positionToAddYAxis, 0], size: cubeSize }]
    // })

    // console.log(lastConnections)
    setIsMenu(true)
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
    //setIsMenu(true)
  }
  // return cube from the layer with the right/left edge as the edge param (if cube exsists)
  const findCube = (layer, edge, side) => {
    if (!cubes[layer]) {
      return -1
    }
    let start = 0
    let end = cubes[layer].length - 1

    do {
      let mid = Math.floor((end + start) / 2)
      let xPosition =
        side === 'right'
          ? cubes[layer][mid].position[0] + cubes[layer][mid].size[0] / 2
          : cubes[layer][mid].position[0] - cubes[layer][mid].size[0] / 2
      if (xPosition > edge) {
        end = mid - 1
      } else if (xPosition < edge) {
        start = mid + 1
      } else {
        // in case there is existing cube at the requierd position
        return mid
      }
    } while (start <= end)

    return -1
  }
  // check if the new cube and the cube from its left/right top edge is equal and also if there is a cube above
  const topEdgeComparation = (cubeForCompare, newCube, layer, side) => {
    const cubeForCompareTopEdge = cubeForCompare.position[1] + cubeForCompare.size[1] / 2
    const newCubeTopEdge = newCube.position[1] + newCube.size[1] / 2
    const rightEdge = newCube.position[0] + newCube.size[0] / 2
    const leftEdge = newCube.position[0] - newCube.size[0] / 2
    // the new cube top edge is equal to the cube for compare
    if (newCubeTopEdge === cubeForCompareTopEdge) {
      let index
      if (side === 'left') {
        index = findCube(layer + 1, leftEdge, 'right')
      } else {
        index = findCube(layer + 1, rightEdge, 'left')
      }
      // there is no cube above cube for compare
      if (index === -1) {
        console.log('the cubes top edge is equal with no cube above ')
        return 'equal'
      }
      // in case cube for compare display is equal false there is 2 options:
      // 1. if the cube above displation is false as well -> the cube edge higher than the new one
      // 2. if the cube above displation is true the cubes edges is equal and there is a cube above
      if (cubeForCompare.display === false) {
        if (cubes[layer + 1][index].display === false) {
          console.log(`there is a cube ${side} to new cube with higher edge `)
          return 'lower'
        } else if (cubes[layer + 1][index].display === true) {
          console.log('the cubes top edge is equal with also a cube above ')
          return 'equal and cube above'
        }
      }
      // in case cube to compare edge is the same as new cube and also index is differ from -1
      else {
        console.log('the cubes top edge is equal with also a cube above ')
        return 'equal and cube above'
      }
    }
    // in case the top edges are different the new cube top edge must be lower
    else {
      console.log(`there is a cube ${side} to new cube with higher edge `)
      return 'lower'
    }
  }
  // when the new cube connecting from top has a cube from one of the sides:
  // calculate the ratio between the cubes (same height with another cube on top,same height,higher,lower)
  const calculateCubeConnectionRatio = (newCube, numberLayer, edge, side) => {
    const oppositeSide = side === 'left' ? 'right' : 'left'
    const indexOfTopCube = findCube(numberLayer + newCube.size[1], edge, oppositeSide)
    // in case there is a cube that its top edge match to new cube top edge and also the cube is next to new cube its side
    if (indexOfTopCube !== -1) {
      const cubeForCompare = cubes[numberLayer + newCube.size[1]][indexOfTopCube]
      return topEdgeComparation(cubeForCompare, newCube, numberLayer + newCube.size[1], side)
    }
    // in case there is a cube next to new cube side but its top edge is smaller than new cube top edge
    else {
      return 'higher'
    }
  }
  const calcJoinsTopConnection = (newCube, numberLayer) => {
    console.log('new cube is :', newCube)
    console.log('layer bellow is:', numberLayer)
    const leftEdge = newCube.position[0] - newCube.size[0] / 2
    const rightEdge = newCube.position[0] + newCube.size[0] / 2
    let isCubeFromRightSideBellow = findCube(numberLayer, rightEdge, 'left') // flag responsible for checking if the there ia cube from the right to edge of the cube layer bellow
    let isCubeFromLeftSideBellow = findCube(numberLayer, leftEdge, 'right') // flag responsible for checking if the there ia cube from the left to edge of the cube layer bellow
    let isCubeFromRightSide = findCube(numberLayer + 1, rightEdge, 'left') // flag responsible for checking if the there ia cube from the right to edge of the new cube
    let isCubeFromLeftSide = findCube(numberLayer + 1, leftEdge, 'right') // flag responsible for checking if the there ia cube from the left to edge of the mew cube
    // in case no cubes from the left and right
    console.log('index of cube from right side layer bellow:', isCubeFromRightSideBellow)
    console.log('index of cube from left side layer bellow:', isCubeFromLeftSideBellow)
    if (isCubeFromLeftSideBellow === -1 && isCubeFromRightSideBellow === -1) {
      setJoins((prev) => {
        console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
        return { ...prev, join4Exists: prev.join4Exists + 4 }
      })
      return
    }
    // in case there are cube from right and left edges of the new cube in the layer bellow
    else if (isCubeFromLeftSideBellow !== -1 && isCubeFromRightSideBellow !== -1) {
      // in case there are cube from right and left edges of the new cube
      if (isCubeFromLeftSide !== -1 && isCubeFromRightSide !== -1) {
        const leftAnswear = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
        const rightAnswear = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
        const combinedValue = `${leftAnswear}-${rightAnswear}`
        switch (combinedValue) {
          case 'equal-equal':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'equal-equal and cube above':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 2, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join3Exists: prev.join3Exists - 2, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'equal-lower':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 2, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join3Exists: prev.join3Exists - 2, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'equal-higher':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'equal and cube above-equal':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 2, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join3Exists: prev.join3Exists - 2, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'equal and cube above-equal and cube above':
            setJoins((prev) => {
              console.log({ ...prev, join4Exists: prev.join4Exists - 4, join5Exists: prev.join5Exists + 4 })
              return { ...prev, join4Exists: prev.join4Exists - 4, join5Exists: prev.join5Exists + 4 }
            })
            return
          case 'equal and cube above-lower':
            setJoins((prev) => {
              console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'equal and cube above-higher':
            setJoins((prev) => {
              console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'lower-equal':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 2, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join3Exists: prev.join3Exists - 2, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'lower-equal and cube above':
            setJoins((prev) => {
              console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'lower-lower':
            setJoins((prev) => {
              console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'lower-higher':
            setJoins((prev) => {
              console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'higher-equal':
            setJoins((prev) => {
              console.log({ ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join3Exists: prev.join3Exists - 4, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'higher-equal and cube above':
            setJoins((prev) => {
              console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
              return { ...prev, join5Exists: prev.join5Exists + 2 }
            })
            return
          case 'higher-lower':
            setJoins((prev) => {
              console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join4Exists: prev.join4Exists + 4 }
            })
            return
          case 'higher-higher':
            setJoins((prev) => {
              console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
              return { ...prev, join4Exists: prev.join4Exists + 4 }
            })
            return
        }
      }
      // in case there is a cube from left edge and not from right edge of the new cube
      else if (isCubeFromLeftSide !== -1 && isCubeFromRightSide === -1) {
        const answear = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
        if (answear === 'equal') {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2 }
          })
        } else if (answear === 'equal and cube above') {
          setJoins((prev) => {
            console.log({
              ...prev,
              join5Exists: prev.join5Exists + 4,
              join4Exists: prev.join4Exists - 4,
              join3Exists: prev.join3Exists + 2,
            })
            return { ...prev, join5Exists: prev.join5Exists + 4, join4Exists: prev.join4Exists - 4, join3Exists: prev.join3Exists + 2 }
          })
        }
        // in case the cube is higher or lower than the cube next to its left
        else {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 }
          })
        }
        return
      }
      // in case there is a cube from right edge and not from left edge of the new cube
      else if (isCubeFromRightSide !== -1 && isCubeFromLeftSide === -1) {
        const answear = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
        if (answear === 'equal') {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2 }
          })
        } else if (answear === 'equal and cube above') {
          setJoins((prev) => {
            console.log({
              ...prev,
              join5Exists: prev.join5Exists + 4,
              join4Exists: prev.join4Exists - 4,
              join3Exists: prev.join3Exists + 2,
            })
            return { ...prev, join5Exists: prev.join5Exists + 4, join4Exists: prev.join4Exists - 4, join3Exists: prev.join3Exists + 2 }
          })
        }
        // in case the cube is higher or lower than the cube next to its right
        else {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 }
          })
        }
        return
      }
      // in case there are no cubes from the new cube edges
      else {
        setJoins((prev) => {
          console.log({ ...prev, join4Exists: prev.join4Exists - 4, join5Exists: prev.join5Exists + 4, join3Exists: prev.join3Exists + 4 })
          return { ...prev, join4Exists: prev.join4Exists - 4, join5Exists: prev.join5Exists + 4, join3Exists: prev.join3Exists + 4 }
        })
      }
    }
    // in case there is a cube from the left edge of the new cube in layer bellow and no cube from the right
    else if (isCubeFromLeftSideBellow !== -1 && isCubeFromRightSideBellow === -1) {
      if (isCubeFromLeftSide !== -1) {
        const answear = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
        if (answear === 'equal') {
          setJoins((prev) => {
            console.log({ ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists - 2 })
            return { ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists - 2 }
          })
        } else if (answear === 'equal and cube above') {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2 }
          })
        }
        // in case the cube is higher or lower than the cube next to its left
        else {
          setJoins((prev) => {
            console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
            return { ...prev, join4Exists: prev.join4Exists + 4 }
          })
        }
      }
      // in case no cube from new cube left side but there is a cube from left side in the layer bellow
      else {
        setJoins((prev) => {
          console.log({ ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 })
          return { ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 }
        })
      }
    }
    // in case there is a cube from the right edge of the new cube in layer bellow and no cube from the right
    else if (isCubeFromRightSideBellow !== -1 && isCubeFromLeftSideBellow === -1) {
      if (isCubeFromRightSide !== -1) {
        const answear = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
        if (answear === 'equal') {
          setJoins((prev) => {
            console.log({ ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists - 2 })
            return { ...prev, join4Exists: prev.join4Exists + 4, join3Exists: prev.join3Exists - 2 }
          })
        } else if (answear === 'equal and cube above') {
          setJoins((prev) => {
            console.log({ ...prev, join5Exists: prev.join5Exists + 2 })
            return { ...prev, join5Exists: prev.join5Exists + 2 }
          })
        }
        // in case the cube is higher or lower than the cube next to its right
        else {
          setJoins((prev) => {
            console.log({ ...prev, join4Exists: prev.join4Exists + 4 })
            return { ...prev, join4Exists: prev.join4Exists + 4 }
          })
        }
      }
      // in case no cube from new cube right side but there is a cube from right side in the layer bellow
      else {
        setJoins((prev) => {
          console.log({ ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 })
          return { ...prev, join5Exists: prev.join5Exists + 2, join3Exists: prev.join3Exists + 2 }
        })
      }
    }
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
      const rightEdge = cubes[layer][cubes[layer].length - 1].position[0] + cubes[layer][cubes[layer].length - 1].size[0] / 2 // right edge of the layer
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
            const [containsButtomCube] = is_include([leftEdge - cubeSize[0] / 2, Number(layer) - size, 0], cubeSize[0], layer - size)
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
            const [containsButtomCube] = is_include([rightEdge + size, Number(layer) - size, 0], cubeSize[0], layer - size)

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
        // if (findCubeRoom(`${Number(layer) + 1}`, x) === -2) {
        //   console.log('omer')
        //   setMessage('error')
        //   setIsDragging(false)
        //   setPosition([-2, 2, 0])
        //   return
        // }

        if (containsButtomCube && !isOverRide) {
          let i
          for (i = 0; i < cubeSize[1]; i++) {
            const indexToInsert = findCubeRoom(`${Number(layer) + i + size}`, x)
            const yPosition = i === 0 ? 1 + Number(layer) + positionToAddYAxis : 1 + i + Number(layer)
            const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
            const display = i === 0 ? true : false
            if (i === 0 && indexToInsert !== -2) {
              calcJoinsTopConnection({ position: [x, 1 + Number(layer) + positionToAddYAxis], size: cubeSize }, Number(layer))
            }
            if (indexToInsert === -1) {
              // in case the layer in new
              handleAddingCube(`${Number(layer) + i + size}`, [{ position: [x, yPosition, 0], size: cubeAddingSize, display: display }])
            } else if (indexToInsert === -2) {
              console.log(i)
              console.log(Number(layer))
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
                  ...cubes[`${Number(layer) + i + size}`].slice(indexToInsert, cubes[`${Number(layer) + i + size}`].length),
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
          setIsMenu(true)
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
    setMessage(undefined)
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
      {/* popup model */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>עיצוב ארון בהתאמה אישית</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
            לפניכם עמוד בו תוכלו לגרור קוביות ולחברם לקוביות מהצד או מלמעלה ובכך לבנות ארון בהתאמה אישית
          </p>
        </Modal>
      )}
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
          <MenuItem sx={{ color: 'black', display: isSecondaryOpen[0] && isSecondaryOpen[1] === 'קוביות' ? true : 'none' }}>
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
          {isSecondaryOpen[0] && isSecondaryOpen[1] === 'מגירות' && <ShelfUi title={'מגירות'} addNewShelf={addNewShelf} />}
        </Paper>
      </div>

      {message && <ModalMessage typeOfMessage={message} onCloseModal={closeModalMessage} />}
      {!isModalOpen && (
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
              <OrbitControls ref={orbitControlsRef} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
            )}
            {Object.keys(cubes).map((key) =>
              cubes[key].map((cube, index) => cube.display && <Cube key={index} position={cube.position} size={cube.size} />)
            )}

            {isDragging && <DraggingCube position={position} onDrag={handleDrag} size={size} />}
            {/* <GlassShelf /> */}
            <Environment preset="city" />
            <Preload all />
          </Suspense>
        </Canvas>
      )}
      {Object.keys(cubes).map((key) =>
        cubes[key].map((cube, index) => cube.display && addDrawer && <Circle key={index} position={cube.position} cubeSize={cube.size} />)
      )}
    </>
  )
}
