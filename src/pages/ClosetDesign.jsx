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
import Undo from '../components/Undo/Undo'
import FileUpload from '../components/FileUpload/FileUpload'

const globalOffset = 0.04
let bars = { 1: 0, 2: 0, 3: 0 }
let joins = { join3Exists: 0, join4Exists: 0, join5Exists: 0 }
const lastActions = []
export default function ClosetDesign() {
  // for the dragging cube
  const [position, setPosition] = useState([-3, 2, 0])
  // this state responssible to store the possitions and sizes of all the cubes
  const [cubes, setCubes] = useState({
    0: [],
  })
  // Popup modal when the use first enter the page for basic explanation about the essence of the page
  const [isModalOpen, setIsModalOpen] = useState(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMessage({ messageType: 'success', title: 'התחל לבנות ארון', content: '', topPosition: '20%', leftPosition: '40%', arrow: true })
  }
  const [preview, setPreview] = useState('')
  const handleFileChange = (file) => {
    // Create a preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      handleCloseModal()
    }
    reader.readAsDataURL(file)
  }

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
  const [message, setMessage] = useState({
    messageType: undefined,
    title: '',
    content: '',
    topPosition: '',
    leftPosition: '',
    arrow: false,
  })

  const [shelfs, setShelfs] = useState([])

  const orbitControlsRef = useRef()

  const handleResetRotation = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset() // Reset rotation
    }
  }
  // gets the initial value of bars with length 1, how many bars to add for the height of the cube
  // and how many bars to add for the width of the cube, and the cube size
  // and in case the new cube is heigher than the connected cube gets the heightRatio
  const calclutationOfBars = (initialValOf1, initialValOf2, initialValOf3, heightAdding, widthAdding, cubeSize, heightRatio) => {
    let bars1 = initialValOf1
    let bars2 = initialValOf2
    let bars3 = initialValOf3
    bars1 += cubeSize[0] === 1 && widthAdding
    bars1 += cubeSize[1] === 1 && heightAdding
    bars2 += cubeSize[0] === 2 && widthAdding
    bars2 += cubeSize[1] === 2 && heightAdding
    bars3 += cubeSize[0] === 3 && widthAdding
    bars3 += cubeSize[1] === 3 && heightAdding
    // in case the new cube is higher add 2 bars with length of the heightRatio
    if (heightRatio) {
      if (heightRatio === 1) {
        bars1 += 2
      } else {
        bars2 += 2
      }
    }
    bars[1] = bars[1] + bars1
    bars[2] = bars[2] + bars2
    bars[3] = bars[3] + bars3
    //console.log(bars)
    console.log(JSON.parse(JSON.stringify(bars)))
  }
  const calcBarsWhenNewCubeIsLower = (heightRatio) => {
    console.log('height differences: ', heightRatio)
    if (heightRatio === 0) {
      return [0, 0, 0]
    }
    if (heightRatio === 2) {
      return [2, 2, -2]
    } else {
      return [4, -2, 0]
    }
  }
  const updateJoins = (join3, join4, join5) => {
    joins.join3Exists = joins.join3Exists + join3
    joins.join4Exists = joins.join4Exists + join4
    joins.join5Exists = joins.join5Exists + join5
    //console.log(joins)
    console.log(JSON.parse(JSON.stringify(joins)))
  }
  const addingCubeToSide = (layer, positionToAddYAxis, cubeSize, xPosition, side) => {
    layer = Number(layer)
    const isLayer0 = layer === 0 ? true : false
    let oppositeSide
    let edge
    let offset = [0, 0]
    const leftSide = xPosition - cubeSize[0] / 2
    const rightSide = xPosition + cubeSize[0] / 2
    let isCubeFromSide // checks if in the layer bellow there is a cube that its edge oppsite edge match the new cube edge
    let isShorterConnectionSide // checks is the new cube edge does not match to any cube edge in the layer bellow
    let isShorterOtherSide
    let widthRatio = 0
    if (side === 'left') {
      edge = rightSide
      oppositeSide = 'right'
      isCubeFromSide = findCube(Number(layer) - 1, leftSide, 'right')
      isShorterConnectionSide = findCube(Number(layer) - 1, leftSide, 'left')
      if (isShorterConnectionSide === -1) {
        isShorterOtherSide = findCube(Number(layer) - 1, rightSide, 'right')
        if (isShorterOtherSide !== -1) {
          const cubeLayerBellow = cubes[Number(layer) - 1][isShorterOtherSide]
          widthRatio = Math.abs(cubeLayerBellow.position[0] - cubeLayerBellow.size[0] / 2 - leftSide)
        }
      }
    } else {
      edge = leftSide
      oppositeSide = 'left'
      isCubeFromSide = findCube(Number(layer) - 1, rightSide, 'left')
      isShorterConnectionSide = findCube(Number(layer) - 1, rightSide, 'right')
      if (isShorterConnectionSide === -1) {
        isShorterOtherSide = findCube(Number(layer) - 1, leftSide, 'left')
        if (isShorterOtherSide !== -1) {
          const cubeLayerBellow = cubes[Number(layer) - 1][isShorterOtherSide]
          widthRatio = Math.abs(cubeLayerBellow.position[0] + cubeLayerBellow.size[0] / 2 - rightSide)
        }
      }
    }
    const newCube = { position: [xPosition, Number(layer) + positionToAddYAxis], size: cubeSize }
    // checks the ratio between top edge of the new cube to the cube top edge connected cube
    const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, Number(layer) - 1, edge, oppositeSide)
    console.log('answear is :', answear)
    // in case there it is layer 0
    if (isLayer0) {
      // in case top edges of the new cube and connected cube are equal
      if (answear === 'equal') {
        updateJoins(0, 4, 0)
        calclutationOfBars(2, 0, 0, 2, 4, cubeSize)
      }
      // in case top edges of the new cube and connected cube are equal and also there is a cube above the connected cube
      else if (answear === 'equal and cube above') {
        updateJoins(2, 0, 2)
        calclutationOfBars(2, 0, 0, 2, 4, cubeSize)
      }
      // in case the new cube higher fron the connected cube
      else if (answear === 'higher') {
        updateJoins(2, 4, 0)
        calclutationOfBars(3, 0, 0, 2, 4, cubeSize, heightRatio)
      }
      // in case the new cube is lower than the connected cube
      else {
        updateJoins(2, 4, 0)
        const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
        calclutationOfBars(3 + bar1, bar2, bar3, 2, 4, cubeSize)
      }
    }
    // in case it is not layer 0 and there is a cube from the side in the layer bellow
    else if (isCubeFromSide !== -1) {
      // in case top edges of the new cube and connected cube are equal and also there is a cube above the connected cube
      if (answear === 'equal and cube above') {
        updateJoins(0, -4, 4)
      }
      // in case the top edge of the new cube is lower than the cube its connected to
      else if (answear === 'lower') {
        updateJoins(0, 0, 2)
      }
      // in case the new cube higher or equal the update of joins is the same
      else {
        updateJoins(-2, 0, 2)
      }
    }
    // in case it is not layer 0 and there is no cube from the side in the layer bellow
    else {
      // in case top edges of the new cube and connected cube are equal
      if (answear === 'equal') {
        if (isShorterConnectionSide !== -1) {
          updateJoins(-2, 4, 0)
        } else {
          updateJoins(0, 4, 0)
        }
      }
      // in case top edges of the new cube and connected cube are equal and also there is a cube above the connected cube
      else if (answear === 'equal and cube above') {
        if (isShorterConnectionSide !== -1) {
          updateJoins(0, 0, 2)
        } else {
          updateJoins(2, 0, 2)
        }
      }
      // in case the new cube higher or lower the update of joins is the same
      else {
        if (isShorterConnectionSide !== -1) {
          updateJoins(0, 4, 0)
        } else {
          updateJoins(2, 4, 0)
        }
      }
    }
    // this block of code responsible to calc the offset
    if (isLayer0) {
      // in case it is layer 0 and  connect from the left
      if (side === 'left') {
        const conectedCube = cubes[0][0] // in case the layer is 0 calc the offset to right for the cube
        offset[0] = conectedCube.offset[0]
        offset[1] = conectedCube.offset[1]
        offset[0] += globalOffset
        //in case the connected cube is 2 add another offset(because it represent as 2 cobe connected togther hance the left cube has offset itself)
        if (conectedCube.size[0] === 2) {
          offset[0] += globalOffset
        }
        // same princeble as the if above
        if (conectedCube.size[0] === 3) {
          offset[0] += globalOffset * 2
        }
        // if it is layer0 and connected from right the calc of the offset happen after the func is over
      }
    }
    // in case the connection is not on layer 0 calc the offset as it is so conneceted fron top
    // also calculate the adding bars
    else {
      offset = calcOffsetWhenIsTopConnection(Number(layer), Number(layer) - 1, cubeSize, xPosition)
      // calculate the adding bars acording to the height of the new cube compare to the height of the connected cube
      const [widthBar1, widthBar2, widthBar3] = calcBarsWhenNewCubeIsLower(widthRatio)
      if (answear === ' lower') {
        const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
        calclutationOfBars(2 + bar1 + widthBar1, bar2 + widthBar2, bar3 + widthBar3, 2, 2, cubeSize)
      } else if (answear === 'higher') {
        calclutationOfBars(2 + widthBar1, widthBar2, widthBar3, 2, 2, cubeSize, heightRatio)
      }
      // in case the cube top edge is equal to the connected cube (or cube above) to edge
      else {
        calclutationOfBars(1 + widthBar1, widthBar2, widthBar3, 2, 2, cubeSize)
      }
    }

    for (let i = 0; i < cubeSize[1]; i++) {
      const yPosition = i === 0 ? Number(layer) + positionToAddYAxis : i + Number(layer)
      const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
      const display = i === 0 ? true : false
      // const offsetToAdd = Number(layer) === 0 ? offset : [0, 0]

      let updatingLayerArr
      // in case the layer exists add the cube to the start or the end of the layer (depending on if the connection is from the left or right)
      if (cubes[Number(layer) + i]) {
        // in case the connection is from the left adding the new cube to the start of the layer
        if (side === 'left') {
          // in case it is not layer 0 dont add offset

          updatingLayerArr = [
            { position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display, offset: offset },
            ...cubes[Number(layer) + i],
          ]

          // in case the connection is from the right adding the cube to the right of the layer
        } else {
          updatingLayerArr = [
            ...cubes[Number(layer) + i],
            { position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display, offset: offset },
          ]
        }
        // in case there is no layer open new one
      } else {
        updatingLayerArr = [{ position: [xPosition, yPosition, 0], size: cubeAddingSize, display: display, offset: offset }]
      }
      handleAddingCube(Number(layer) + i, updatingLayerArr)
    }
    setIsMenu(true)
    setIsDragging(false)
    setPosition([-3, 2, 0])
  }

  // this function return true if there is enough room for the cube (x-axis)
  // and also return the position of the x to the new cube
  const is_include = (cube, xSize, layer) => {
    let include = false
    let xPosition = 0 // if there is connection' this val store the position on the x axis of the new cube
    const epsilon = 0.1
    for (let index = 0; index < cubes[layer].length; index++) {
      const val = cubes[layer][index]
      //checks if the left edge of the upper cube is equal to the left edge of the cube bellow
      if (Math.abs(val.position[0] - val.size[0] / 2 + val.offset[0] - (cube[0] - xSize / 2)) < epsilon) {
        let rightEdge = val.position[0] + val.size[0] / 2
        let sum = 0
        for (let i = index; i < cubes[layer].length; i++) {
          const leftEdge = cubes[layer][i].position[0] - cubes[layer][i].size[0] / 2
          if (sum === 0) {
            sum += cubes[layer][i].size[0]
          }
          // in case it is the second cube (or futher) that i encounter, checks if its right next to the cube before
          else {
            if (leftEdge === rightEdge) {
              sum += cubes[layer][i].size[0]
            }
            // if there is gap between the cube and the previous cube return false
            else {
              return [false, -3]
            }
          }

          if (sum >= xSize) {
            include = true
            xPosition = val.position[0] - val.size[0] / 2 + xSize / 2
            return [include, xPosition]
          }
          rightEdge = cubes[layer][i].position[0] + cubes[layer][i].size[0] / 2
        }
        return [false, -3]
      }
      //checks if the right edge of the upper cube is equal to the right edge of the cube bellow
      if (Math.abs(val.position[0] + val.size[0] / 2 + val.offset[0] - (cube[0] + xSize / 2)) < epsilon) {
        let sum = 0
        let leftEdge = val.position[0] - val.size[0] / 2
        for (let i = index; i >= 0; i--) {
          const rightEdge = cubes[layer][i].position[0] + cubes[layer][i].size[0] / 2
          if (sum === 0) {
            sum += cubes[layer][i].size[0]
          }
          // in case it is the second cube (or futher) that i encounter, checks if its right next to the cube before left
          else {
            if (rightEdge === leftEdge) {
              sum += cubes[layer][i].size[0]
            } else {
              return [false, -3]
            }
          }
          if (sum >= xSize) {
            include = true
            xPosition = val.position[0] + val.size[0] / 2 - xSize / 2
            return [include, xPosition]
          }
          leftEdge = cubes[layer][i].position[0] - cubes[layer][i].size[0] / 2
        }
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
          (cubeRightEdge > cube.position[0] - cube.size[0] / 2 && cubeRightEdge < cube.position[0] + cube.size[0] / 2) ||
          (cubeRightEdge === cube.position[0] + cube.size[0] / 2 && cubeLeftEdge < cube.position[0] - cube.size[0] / 2) ||
          (cubeLeftEdge === cube.position[0] - cube.size[0] / 2 && cubeRightEdge > cube.position[0] + cube.size[0] / 2)
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
    setMessage({
      messageType: 'success',
      title: '! חיבור קוביות חוקי',
      content: 'המשך לחבר קוביות כרצונך',
      topPosition: '20%',
      leftPosition: '50%',
      arrow: false,
    })
    // setIsMenu(true)
  }
  const closeModalMessage = () => {
    setMessage({ messageType: undefined, title: '', content: '', topPosition: '', leftPosition: '', arrow: false })
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
          const heightRatio = cubes[layer + 1][index].position[1] + cubes[layer + 1][index].size[1] - newCubeTopEdge
          return ['lower', heightRatio]
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
      const heightRatio = cubeForCompareTopEdge - newCubeTopEdge
      return ['lower', heightRatio]
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
      const comparation = topEdgeComparation(cubeForCompare, newCube, numberLayer + newCube.size[1], side)
      if (typeof comparation === 'string') {
        return [comparation]
      }
      return comparation
    }
    // in case there is a cube next to new cube side but its top edge is smaller than new cube top edge
    else {
      if (findCube(numberLayer + newCube.size[1] - 1, edge, oppositeSide) === -1) {
        return ['higher', 2]
      }
      return ['higher', 1]
    }
  }
  const calcJoinsAndBarsWhenCubeHorizontalEdgeShorter = (
    side,
    oppositeSide,
    numberLayer,
    isCubeWithEqualEdgeLayerBellow, // this param is the index of the cube layer bellow that match the edge of new cube
    cubeEdge, // the edge of the cube that has a match in the layer bellow
    isCubeFromSide, // index of the cube that connects from the side of the new cube that has a match in the edge of the layer bellow
    isCubeFromSideBellow, // index of the cube in the layer bellow that connects to the cube that the new cube sits on
    isCubeFromOtherSide, // index of the cube that connect to the cube from the side that its edge does not match to any cube in the layer bellow
    cubeSize,
    newCube,
    cubeSecondEdge // the edge that does not match to any cube in the layer bellow
  ) => {
    // this section is responsible for calculate the width differences of the new cube and the cube in the layer bellow
    const cubeLayerBellow = cubes[numberLayer][isCubeWithEqualEdgeLayerBellow]
    let edgeOfCubeBellow
    if (side === 'left') {
      edgeOfCubeBellow = cubeLayerBellow.position[0] + cubeLayerBellow.size[0] / 2
    } else {
      edgeOfCubeBellow = cubeLayerBellow.position[0] - cubeLayerBellow.size[0] / 2
    }
    const widthRatio = Math.abs(edgeOfCubeBellow - cubeSecondEdge)
    const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(widthRatio)

    // in case the new cube has cubes from left and right
    if (isCubeFromSide !== -1 && isCubeFromOtherSide !== -1) {
      if (side === 'left') {
        calcJoinsAndBarsWhenCubesFromBothSides(newCube, numberLayer, cubeEdge, cubeSecondEdge)
      } else {
        calcJoinsAndBarsWhenCubesFromBothSides(newCube, numberLayer, cubeSecondEdge, cubeEdge)
      }
    }
    // in case the new cube has cube from left side
    else if (isCubeFromSide !== -1) {
      const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, cubeEdge, side)
      if (answear === 'equal') {
        calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
        updateJoins(0, 4, 0)
      } else if (answear === 'equal and cube above') {
        calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
        updateJoins(2, 0, 2)
      } else if (answear === 'higher') {
        calclutationOfBars(3 + bar1, bar2, bar3, 2, 2, cubeSize, heightRatio)
        updateJoins(2, 4, 0)
      } else {
        const [heightBar1, heightBar2, heightBar3] = calcBarsWhenNewCubeIsLower(heightRatio)
        calclutationOfBars(3 + bar1 + heightBar1, bar2 + heightBar2, bar3 + heightBar3, 2, 2, cubeSize)
        updateJoins(2, 4, 0)
      }
    }
    // in case there is a cube from left side in the layer bellow and no cube from the right
    else if (isCubeFromSideBellow !== -1 && isCubeFromOtherSide === -1) {
      calclutationOfBars(3 + bar1, bar2, bar3, 4, 2, cubeSize)
      updateJoins(4, 0, 2)
    }
    // in case there is a cube from right side and no cube from the left in the layer bellow
    else if (isCubeFromSideBellow === -1 && isCubeFromOtherSide !== -1) {
      const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, cubeSecondEdge, oppositeSide)
      if (answear === 'equal') {
        calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
        updateJoins(-2, 4, 0)
      } else if (answear === 'equal and cube above') {
        calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
        updateJoins(0, 0, 2)
      } else if (answear === 'higher') {
        calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
        updateJoins(0, 4, 0)
      } else {
        const [heightBar1, heightBar2, heightBar3] = calcBarsWhenNewCubeIsLower(heightRatio)
        calclutationOfBars(2 + heightBar1, heightBar2, heightBar3, 2, 2, cubeSize)
        updateJoins(0, 4, 0)
      }
    }
    // in case there is a cube from right side and also a cube from left side in the layer bellow
    else if (isCubeFromSideBellow !== -1 && isCubeFromOtherSide !== -1) {
      const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, cubeSecondEdge, oppositeSide)
      if (answear === 'equal') {
        calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
        updateJoins(0, 0, 2)
      } else if (answear === 'equal and cube above') {
        calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
        updateJoins(2, -4, 4)
      } else if (answear === 'higher') {
        calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
        updateJoins(2, 0, 2)
      } else {
        const [heightBar1, heightBar2, heightBar3] = calcBarsWhenNewCubeIsLower(heightRatio)
        calclutationOfBars(2 + heightBar1, heightBar2, heightBar3, 2, 2, cubeSize)
        updateJoins(2, 0, 2)
      }
    }
    // in case no cube from left in the layer bellow and no cube from right
    else {
      calclutationOfBars(2 + bar1, bar2, bar3, 4, 2, cubeSize)
      updateJoins(2, 4, 0)
    }
    return
  }
  const calcJoinsAndBarsWhenCubesFromBothSides = (newCube, numberLayer, leftEdge, rightEdge) => {
    const cubeSize = newCube.size
    const [leftAnswear, leftHeightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
    const [rightAnswear, rightHeightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
    const combinedValue = `${leftAnswear}-${rightAnswear}`
    console.log(combinedValue)
    let leftBar1 = 0
    let leftBar2 = 0
    let leftBar3 = 0
    let rightBar1 = 0
    let rightBar2 = 0
    let rightBar3 = 0
    if (leftAnswear === 'lower') {
      const bars = calcBarsWhenNewCubeIsLower(leftHeightRatio)
      leftBar1 = bars[0]
      leftBar2 = bars[1]
      leftBar3 = bars[2]
    }
    if (rightAnswear === 'lower') {
      const bars = calcBarsWhenNewCubeIsLower(rightHeightRatio)
      rightBar1 = bars[0]
      rightBar2 = bars[1]
      rightBar3 = bars[2]
    }
    switch (combinedValue) {
      case 'equal-equal':
        console.log('omer')
        calclutationOfBars(0, 0, 0, 0, 2, cubeSize)
        updateJoins(-4, 4, 0)
        return
      case 'equal-equal and cube above':
        calclutationOfBars(0, 0, 0, 0, 2, cubeSize)
        updateJoins(-2, 0, 2)
        return
      case 'equal-lower':
        calclutationOfBars(1 + rightBar1, rightBar2, rightBar3, 0, 2, cubeSize)
        updateJoins(-2, 4, 0)
        return
      case 'equal-higher':
        calclutationOfBars(1, 0, 0, 0, 2, cubeSize, rightHeightRatio)
        updateJoins(-4, 4, 0)
        return
      case 'equal and cube above-equal':
        calclutationOfBars(0, 0, 0, 0, 2, cubeSize)
        updateJoins(-2, 0, 2)
        return
      case 'equal and cube above-equal and cube above':
        calclutationOfBars(0, 0, 0, 0, 2, cubeSize)
        updateJoins(0, -4, 4)
        return
      case 'equal and cube above-lower':
        calclutationOfBars(1 + rightBar1, rightBar2, rightBar3, 0, 2, cubeSize)
        updateJoins(0, 0, 2)
        return
      case 'equal and cube above-higher':
        calclutationOfBars(1, 0, 0, 0, 2, cubeSize, rightHeightRatio)
        updateJoins(0, 0, 2)
        return
      case 'lower-equal':
        // console.log('whattt')
        calclutationOfBars(1 + leftBar1, leftBar2, leftBar3, 0, 2, cubeSize)
        updateJoins(-2, 4, 0)
        return
      case 'lower-equal and cube above':
        calclutationOfBars(1 + leftBar1, leftBar2, leftBar3, 0, 2, cubeSize)
        updateJoins(0, 0, 2)
        return
      case 'lower-lower':
        calclutationOfBars(2 + leftBar1, leftBar2, leftBar3, 0, 2, cubeSize)
        calclutationOfBars(rightBar1, rightBar2, rightBar3, 0, 0, cubeSize)
        updateJoins(0, 4, 0)
        return
      case 'lower-higher':
        calclutationOfBars(1 + leftBar1, leftBar2, leftBar3, 0, 2, cubeSize, rightHeightRatio)
        calcBarsWhenNewCubeIsLower(leftHeightRatio)
        updateJoins(0, 4, 0)
        return
      case 'higher-equal':
        calclutationOfBars(1, 0, 0, 0, 2, cubeSize, leftHeightRatio)
        updateJoins(-2, 4, 0)
        return
      case 'higher-equal and cube above':
        calclutationOfBars(1, 0, 0, 0, 2, cubeSize, leftHeightRatio)
        updateJoins(0, 0, 2)
        return
      case 'higher-lower':
        calclutationOfBars(1 + rightBar1, rightBar2, rightBar3, 0, 2, cubeSize, leftHeightRatio)
        updateJoins(0, 4, 0)
        return
      case 'higher-higher':
        calclutationOfBars(1, 0, 0, 0, 2, cubeSize, leftHeightRatio)
        calclutationOfBars(1, 0, 0, 0, 0, cubeSize, rightHeightRatio)
        updateJoins(0, 4, 0)
        return
    }
  }
  const calcJoinsTopConnection = (newCube, numberLayer) => {
    const cubeSize = newCube.size
    const leftEdge = newCube.position[0] - newCube.size[0] / 2
    const rightEdge = newCube.position[0] + newCube.size[0] / 2
    let isCubeFromRightSideBellow = findCube(numberLayer, rightEdge, 'left') // flag responsible for checking if the there ia cube from the right to edge of the cube layer bellow
    let isCubeFromLeftSideBellow = findCube(numberLayer, leftEdge, 'right') // flag responsible for checking if the there ia cube from the left to edge of the cube layer bellow
    let isCubeFromRightSide = findCube(numberLayer + 1, rightEdge, 'left') // flag responsible for checking if the there ia cube from the right to edge of the new cube
    let isCubeFromLeftSide = findCube(numberLayer + 1, leftEdge, 'right') // flag responsible for checking if the there ia cube from the left to edge of the mew cube
    let isCubeWithEqualLeftEdgeLayerBellow = findCube(numberLayer, leftEdge, 'left')
    let isCubeWithEqualRightEdgeLayerBellow = findCube(numberLayer, rightEdge, 'right')
    // in case no cubes from the left and right
    console.log('index of cube from right side layer bellow:', isCubeFromRightSideBellow)
    console.log('index of cube from left side layer bellow:', isCubeFromLeftSideBellow)
    if (isCubeWithEqualRightEdgeLayerBellow !== -1 && isCubeWithEqualLeftEdgeLayerBellow === -1) {
      console.log('rightomer')
      calcJoinsAndBarsWhenCubeHorizontalEdgeShorter(
        'right',
        'left',
        numberLayer,
        isCubeWithEqualRightEdgeLayerBellow,
        rightEdge,
        isCubeFromRightSide,
        isCubeFromRightSideBellow,
        isCubeFromLeftSide,
        cubeSize,
        newCube,
        leftEdge
      )
      return
    }
    // in case the new cube match to left edge of some cube in the layer bellow but doesnt match to right edge of all of the cubes
    if (isCubeWithEqualLeftEdgeLayerBellow !== -1 && isCubeWithEqualRightEdgeLayerBellow === -1) {
      console.log('leftomer')
      calcJoinsAndBarsWhenCubeHorizontalEdgeShorter(
        'left',
        'right',
        numberLayer,
        isCubeWithEqualLeftEdgeLayerBellow,
        leftEdge,
        isCubeFromLeftSide,
        isCubeFromLeftSideBellow,
        isCubeFromRightSide,
        cubeSize,
        newCube,
        rightEdge
      )
      return
    }
    if (isCubeFromLeftSideBellow === -1 && isCubeFromRightSideBellow === -1) {
      calclutationOfBars(2, 0, 0, 4, 2, cubeSize)
      updateJoins(0, 4, 0)
      return
    }
    // in case there are cube from right and left edges of the new cube in the layer bellow
    else if (isCubeFromLeftSideBellow !== -1 && isCubeFromRightSideBellow !== -1) {
      // in case there are cube from right and left edges of the new cube
      if (isCubeFromLeftSide !== -1 && isCubeFromRightSide !== -1) {
        calcJoinsAndBarsWhenCubesFromBothSides(newCube, numberLayer, leftEdge, rightEdge)
        return
      }
      // in case there is a cube from left edge and not from right edge of the new cube
      else if (isCubeFromLeftSide !== -1 && isCubeFromRightSide === -1) {
        const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
        if (answear === 'equal') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(0, 0, 2)
        } else if (answear === 'equal and cube above') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(2, -4, 4)
        }
        // in case the cube is  lower than the cube next to its left
        else if (answear === 'lower') {
          const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
          calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
          updateJoins(2, 0, 2)
        }
        // in case the new cube is higher than the cube next to its left
        else {
          calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
          updateJoins(2, 0, 2)
        }
        return
      }
      // in case there is a cube from right edge and not from left edge of the new cube
      else if (isCubeFromRightSide !== -1 && isCubeFromLeftSide === -1) {
        const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
        if (answear === 'equal') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(0, 0, 2)
        } else if (answear === 'equal and cube above') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(2, -4, 4)
        }
        // in case the cube is higher or lower than the cube next to its right
        else if (answear === 'lower') {
          const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
          calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
          updateJoins(2, 0, 2)
        }
        // in case the cube is higher than the cube next to its right
        else {
          calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
          updateJoins(2, 0, 2)
        }
        return
      }
      // in case there are no cubes from the new cube edges
      else {
        calclutationOfBars(2, 0, 0, 4, 2, cubeSize)
        updateJoins(4, -4, 4)
      }
    }
    // in case there is a cube from the left edge of the new cube in layer bellow and no cube from the right
    else if (isCubeFromLeftSideBellow !== -1 && isCubeFromRightSideBellow === -1) {
      if (isCubeFromLeftSide !== -1) {
        const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, leftEdge, 'left')
        if (answear === 'equal') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(-2, 4, 0)
        } else if (answear === 'equal and cube above') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(0, 0, 2)
        }
        // in case the cube is higher or lower than the cube next to its left
        else if (answear === 'lower') {
          const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
          calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
          updateJoins(0, 4, 0)
        }
        // in case the new cube is higher than the cube next to its left
        else {
          calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
          updateJoins(0, 4, 0)
        }
      }
      // in case no cube from new cube left side but there is a cube from left side in the layer bellow
      else {
        calclutationOfBars(2, 0, 0, 4, 2, cubeSize)
        updateJoins(2, 0, 2)
      }
    }
    // in case there is a cube from the right edge of the new cube in layer bellow and no cube from the left
    else if (isCubeFromRightSideBellow !== -1 && isCubeFromLeftSideBellow === -1) {
      if (isCubeFromRightSide !== -1) {
        const [answear, heightRatio] = calculateCubeConnectionRatio(newCube, numberLayer, rightEdge, 'right')
        if (answear === 'equal') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(-2, 4, 0)
        } else if (answear === 'equal and cube above') {
          calclutationOfBars(1, 0, 0, 2, 2, cubeSize)
          updateJoins(0, 0, 2)
        }
        // in case the cube is lower than the cube next to its right
        else if (answear === 'lower') {
          const [bar1, bar2, bar3] = calcBarsWhenNewCubeIsLower(heightRatio)
          calclutationOfBars(2 + bar1, bar2, bar3, 2, 2, cubeSize)
          updateJoins(0, 4, 0)
        }
        // in case the cube is higher than the cube next to its right
        else {
          calclutationOfBars(2, 0, 0, 2, 2, cubeSize, heightRatio)
          updateJoins(0, 4, 0)
        }
      }
      // in case no cube from new cube right side but there is a cube from right side in the layer bellow
      else {
        calclutationOfBars(2, 0, 0, 4, 2, cubeSize)
        updateJoins(2, 0, 2)
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
  const calcOffsetWhenIsTopConnection = (layer, buttomLayer, cubeSize, xPosition) => {
    const offset = [0, layer * globalOffset]
    // try find cube in the layer bellow with the same right edge as the new cube
    const indexOFButoomCubeFromRight = findCube(buttomLayer, xPosition + cubeSize[0] / 2, 'right')

    // in case there is a cube bellow with the same right edge calc the offset of the new cube acording to the bellow cube
    if (indexOFButoomCubeFromRight !== -1) {
      const buttomRightCubeOffset = cubes[buttomLayer][indexOFButoomCubeFromRight].offset[0]
      offset[0] = buttomRightCubeOffset
    }
    // in case there is no cube in the layer bellow with right edge as the new cube
    else {
      // finde cube with in the layer bellow with the same left edge as new cube
      const indexOFButoomCubeFromLeft = findCube(buttomLayer, xPosition - cubeSize[0] / 2, 'left')
      console.log('indexx left = : ', indexOFButoomCubeFromRight)
      if (indexOFButoomCubeFromLeft !== -1) {
        const buttomLeftCubeOffset = cubes[buttomLayer][indexOFButoomCubeFromLeft].offset[0]
        const buttomLeftCubeSize = cubes[buttomLayer][indexOFButoomCubeFromLeft].size[0]
        if (buttomLeftCubeSize === 1) {
          if (cubeSize[0] === buttomLeftCubeSize) {
            offset[0] = buttomLeftCubeOffset
          } else {
            offset[0] = buttomLeftCubeOffset - (cubeSize[0] - buttomLeftCubeSize) * globalOffset
          }
        } else if (buttomLeftCubeSize === 2) {
          if (cubeSize[0] < buttomLeftCubeSize) {
            offset[0] = buttomLeftCubeOffset + globalOffset
          } else if (cubeSize[0] === buttomLeftCubeSize) {
            offset[0] = buttomLeftCubeOffset
          } else {
            offset[0] = buttomLeftCubeOffset - globalOffset
          }
        } else {
          offset[0] = buttomLeftCubeOffset + (buttomLeftCubeSize - cubeSize[0]) * globalOffset
        }
      }
    }
    return offset
  }
  const handleDrag = (newPosition, cubeSize) => {
    setPosition(newPosition)
    const epsilon = 0.2
    const size = 1
    const layer = Math.floor(newPosition[1])

    if (layer < 0) {
      return
    }
    let positionToAddYAxis = 0
    if (cubeSize[1] === 2) {
      positionToAddYAxis = 0.5
    } else if (cubeSize[1] === 3) {
      positionToAddYAxis = 1
    }
    const buttomLayer = layer - 1
    if (buttomLayer >= 0 && cubes[buttomLayer]) {
      // check if the dragging cube connects from the top
      if (Math.abs(newPosition[1] - (buttomLayer + size)) < epsilon + positionToAddYAxis) {
        // check if there is a cube to connect to
        const [containsButtomCube, x] = is_include([newPosition[0], buttomLayer, 0], cubeSize[0], buttomLayer)
        // check if the new cube position has enough room on the new layer
        const isOverRide = isEnoughRoom(layer, x, cubeSize)
        if (isOverRide && containsButtomCube) {
          setMessage({
            messageType: 'error',
            title: 'חיבור קוביות לא חוקי',
            content: 'החיבור לא הצליח כי הקובייה המתחברת עלתה על קובייה קיימת, נסה מחדש',
            topPosition: '20%',
            leftPosition: '50%',
            arrow: false,
          })
        }

        if (containsButtomCube && !isOverRide) {
          const offset = calcOffsetWhenIsTopConnection(layer, buttomLayer, cubeSize, x)
          let i
          for (i = 0; i < cubeSize[1]; i++) {
            const indexToInsert = findCubeRoom(`${layer + i}`, x)
            const yPosition = i === 0 ? layer + positionToAddYAxis : i + layer
            const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
            const display = i === 0 ? true : false
            if (i === 0 && indexToInsert !== -2) {
              calcJoinsTopConnection({ position: [x, layer + positionToAddYAxis], size: cubeSize }, buttomLayer)
            }
            if (indexToInsert === -1) {
              // in case the layer in new
              handleAddingCube(`${layer + i}`, [{ position: [x, yPosition, 0], size: cubeAddingSize, display: display, offset: offset }])
            } else if (indexToInsert === -2) {
              console.log(i)
              console.log(Number(layer))
              setMessage({
                messageType: 'error',
                title: 'חיבור קוביות לא חוקי',
                content: 'החיבור לא הצליח כי הקובייה המתחברת עלתה על קובייה קיימת, נסה מחדש',
                topPosition: '20%',
                leftPosition: '50%',
                arrow: false,
              })
              // in case there is already cube in the requierd position
              break
              //return
            } else {
              // in case the new cube is should be at the end of the layer
              if (indexToInsert >= cubes[`${layer + i}`].length) {
                handleAddingCube(`${layer + i}`, [
                  ...cubes[`${layer + i}`],
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display, offset: offset },
                ])
                // in case the new cube should be place at the start of the new layer
              } else if (indexToInsert <= 0) {
                handleAddingCube(`${layer + i}`, [
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display, offset: offset },
                  ...cubes[`${layer + i}`],
                ])
              } else {
                // in case the cube should be place somewhere at the midelle of the layer
                handleAddingCube(`${layer + i}`, [
                  ...cubes[`${layer + i}`].slice(0, indexToInsert),
                  { position: [x, yPosition, 0], size: cubeAddingSize, display: display, offset: offset },
                  ...cubes[`${layer + i}`].slice(indexToInsert, cubes[`${layer + i}`].length),
                ])
              }
            }
          }
          if (i > 0) {
            console.log('top')
            lastActions.push({ type: 'cube', layer: layer, position: [x, layer + positionToAddYAxis], size: cubeSize })
          }
          setIsMenu(true)
          setIsDragging(false)
          setPosition([-3, 2, 0])
          return
        }
      }
    }
    if (!cubes[layer]) {
      return
    }
    //for each key of our layers check if the dragging cube connects to the layer from the left/right

    const leftEdge = cubes[layer.toString()][0].position[0] - cubes[layer.toString()][0].size[0] / 2 // left edge of the layer
    const rightEdge =
      cubes[layer.toString()][cubes[layer.toString()].length - 1].position[0] +
      cubes[layer.toString()][cubes[layer.toString()].length - 1].size[0] / 2 // right edge of the layer

    // check if the dragging cube is in the same height of the layer
    if (Math.abs(newPosition[1] - layer) < epsilon + positionToAddYAxis) {
      const isLayer0 = layer === 0

      // check if the dragging cube is connecting from the left
      if (Math.abs(newPosition[0] + cubeSize[0] / 2 - leftEdge) < epsilon) {
        if (isLayer0) {
          addingCubeToSide(layer.toString(), positionToAddYAxis, cubeSize, leftEdge - cubeSize[0] / 2, 'left')
          console.log('left')
          lastActions.push({ type: 'cube', layer: 0, position: [leftEdge - cubeSize[0] / 2, positionToAddYAxis], size: cubeSize })
          return
        } else {
          // in case try adding cube to layers thats requires cube bellow
          const [containsButtomCube] = is_include([leftEdge - cubeSize[0] / 2, layer - size, 0], cubeSize[0], layer - size)
          const isOverRide = isEnoughRoom(layer, leftEdge - cubeSize[0] / 2, cubeSize)
          if (containsButtomCube && isOverRide) {
            addingCubeToSide(layer, positionToAddYAxis, cubeSize, leftEdge - cubeSize[0] / 2, 'left')
            console.log('left')
            lastActions.push({
              type: 'cube',
              layer: layer,
              position: [leftEdge - cubeSize[0] / 2, layer + positionToAddYAxis],
              size: cubeSize,
            })
            return
          }
        }
        // check if the dragging cube is connecting from the right
      } else if (Math.abs(newPosition[0] - cubeSize[0] / 2 - rightEdge) < epsilon) {
        if (isLayer0) {
          addingCubeToSide(layer.toString(), positionToAddYAxis, cubeSize, rightEdge + cubeSize[0] / 2, 'right')
          console.log('right')
          lastActions.push({ type: 'cube', layer: 0, position: [rightEdge + cubeSize[0] / 2, positionToAddYAxis], size: cubeSize })
          setCubes((prev) => {
            const cubesCopy = JSON.parse(JSON.stringify(prev))
            const offsetToAdd = globalOffset * cubeSize[0]

            for (const key in cubesCopy) {
              cubesCopy[key] = cubesCopy[key].map((item) => {
                if (item.position[0] === rightEdge + cubeSize[0] / 2) {
                  // Return the item unchanged if the condition is met
                  return item
                } else {
                  // Update the offset
                  return {
                    ...item,
                    offset: [item.offset[0] + offsetToAdd, item.offset[1]],
                  }
                }
              })
            }
            console.log('copyCube ', cubesCopy)
            return cubesCopy
          })
          setShelfs((prev) => {
            const offsetToAdd = globalOffset * cubeSize[0]
            return prev.map((shelf) => {
              return {
                ...shelf,
                position: [shelf.position[0] + offsetToAdd, shelf.position[1], shelf.position[2]],
              }
            })
          })

          return
        } else {
          // in case try adding cube to layers thats requires cube bellow
          const [containsButtomCube] = is_include([rightEdge + cubeSize[0] / 2, layer - size, 0], cubeSize[0], layer - size)
          const isOverRide = isEnoughRoom(layer, rightEdge + cubeSize[0] / 2, cubeSize)

          if (containsButtomCube && !isOverRide) {
            addingCubeToSide(layer.toString(), positionToAddYAxis, cubeSize, rightEdge + cubeSize[0] / 2, 'right')
            console.log('right')
            lastActions.push({
              type: 'cube',
              layer: layer,
              position: [rightEdge + cubeSize[0] / 2, layer + positionToAddYAxis],
              size: cubeSize,
            })
            return
          }
        }
      }
    }
  }
  const closeSecondaryMenu = () => {
    setSecondaryOpen([false, undefined])
    setFirstOpen(true)
  }
  // after the user chose size of the dragging cube set its width and height and close the menu
  const newDraggingCube = (width, height) => {
    setSize([width, height])
    setMessage({ messageType: undefined, title: '', content: '', topPosition: '', leftPosition: '', arrow: false })
    setFirstOpen(true)
    setSecondaryOpen([false, undefined])
    if (cubes['0'].length === 0) {
      let yOffset = 0
      if (height === 3) {
        yOffset = 1
      } else if (height === 2) {
        yOffset = 0.5
      }
      for (let i = 0; i < height; i++) {
        const yPosition = i === 0 ? 0 + yOffset : i
        const cubeAddingSize = i === 0 ? [width, height] : [width, 1]

        const display = i === 0 ? true : false
        // in case the layer in new
        handleAddingCube(`${0 + i}`, [{ position: [0, yPosition, 0], size: cubeAddingSize, display: display, offset: [0, 0] }])
      }
      calclutationOfBars(4, 0, 0, 4, 4, [width, height])
      updateJoins(8, 0, 0)
      lastActions.push({ type: 'cube', layer: 0, position: [0, yOffset], size: [width, height] })
      return
    } else {
      setIsDragging(true)
      setIsMenu(false)
    }
  }
  const addNewShelf = (material) => {
    console.log(material)
    setIsMenu(false)
    setFirstOpen(true)
    setSecondaryOpen([false, undefined])
    setAddDrawer(!addDrawer)
  }
  // gets cube and layer and return true if the cube consist shelf, and false otherwise
  const isShelf = (layer, cube) => {
    for (let i = 0; i < shelfs.length; i++) {
      let cubeTopEdge = cube.position[1] + cube.size[1] / 2 - cube.offset[1]
      if (cube.size[1] === 2) {
        cubeTopEdge -= globalOffset
      } else if (cube.size[1] === 3) {
        cubeTopEdge -= 2 * globalOffset
      }
      const cubeXposition = cube.position[0] + cube.offset[0]

      //in case shelf position matchs top edge of the cube
      if (shelfs[i].position[1] === cubeTopEdge && shelfs[i].position[0] === cubeXposition) {
        // in case the cube in layer 0, checking if there a shelf in the buttom of the cube as well
        if (layer === 0) {
          const cubeButtomEdge = cube.position[1] - cube.size[1] / 2
          for (let j = 0; j < shelfs.length; j++) {
            // in case the cube is in layer 0 and there are shelfs that match to its top edge and buttom edge
            if (shelfs[j].position[1] === cubeButtomEdge && shelfs[j].position[0] === cubeXposition) {
              return [true, undefined]
            }
          }
          return [false, 'buttom']
        }
        // in case the cube is not in layer 0 and the shelf match to its top edge
        else {
          return [true, undefined]
        }
      }
    }

    return [false, 'top']
  }
  const handleAddingShelf = (xPosition, yPosition, xSize) => {
    lastActions.push({ type: 'shelf', position: [xPosition, yPosition, 0], xSize: xSize })
    setShelfs((prev) => {
      return [...prev, { position: [xPosition, yPosition, 0], xSize: xSize }]
    })
    setMessage({
      messageType: 'success',
      title: 'המדף נוסף בהצלחה',
      content: 'המשך להוסיף מדפים כרצונך',
      topPosition: '20%',
      leftPosition: '50%',
      arrow: false,
    })
    setAddDrawer(false)
    setIsMenu(true)
  }
  const cancelDragging = () => {
    setIsDragging(false)
    setPosition([-3, 2, 0])
    setIsMenu(true)
  }
  const CancelAddingDrawer = () => {
    setAddDrawer(false)
    setIsMenu(true)
  }
  const removeLastAction = () => {
    console.log(lastActions)
    if (lastActions.length === 0) {
      return
    }
    if (lastActions.length > 0) {
      const lastAction = lastActions.pop()
      if (lastAction.type === 'shelf') {
        setShelfs((prev) => {
          return prev.slice(0, prev.length - 1)
        })
        setMessage({
          messageType: 'success',
          title: 'המדף הוסר בהצלחה',
          content: '',
          arrow: false,
          topPosition: '20%',
          leftPosition: '50%',
        })
        return
      } else {
        console.log(lastAction)
        const xPosition = lastAction.position[0]
        for (let i = lastAction.layer; i < lastAction.size[1] + lastAction.layer; i++) {
          const filteredArray = cubes[i].filter((cube) => {
            return cube.position[0] !== xPosition
          })
          setCubes((prev) => {
            const newCubes = { ...prev }

            if (filteredArray.length > 0) {
              newCubes[i] = filteredArray
            } else {
              delete newCubes[i]
            }
            if (newCubes[0] === undefined) {
              return { 0: [] }
            }

            return newCubes
          })
        }
        setMessage({
          messageType: 'success',
          title: 'הקובייה הוסרה בהצלחה',
          content: '',
          arrow: false,
          topPosition: '20%',
          leftPosition: '50%',
        })
      }
    }
  }

  return (
    <>
      {/* popup modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>עיצוב ארון בהתאמה אישית</h2>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              לפניכם עמוד בו תוכלו לגרור קוביות ולחברם לקוביות מהצד או מלמעלה ובכך לבנות ארון בהתאמה אישית
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>: קודם כל ניתן לבחור תמונת רקע או להמשיך עם הרקע הדיפולטיבי</p>
          </div>
          <FileUpload handleFileChange={handleFileChange} handleClose={handleCloseModal} />
        </Modal>
      )}
      {preview && (
        <div style={{ position: 'absolute' }}>
          <img src={preview} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}

      <div style={{ position: 'absolute', top: '10vh', zIndex: 1000 }}>
        {/* menu container */}
        <Paper sx={{ height: '90vh', width: '15vh', display: !isMenu && 'none' }}>
          {/* first menu - let the use the option to add new cube or shelf */}
          <MenuList>
            <MenuItem
              sx={{ color: 'black', display: !isFirstOpen && 'none', marginBottom: 1 }}
              onClick={() => {
                setFirstOpen(false)
                setSecondaryOpen([true, 'קוביות'])
                handleResetRotation()
              }}
            >
              קוביות
            </MenuItem>
            <MenuItem
              sx={{ color: 'black', display: !isFirstOpen && 'none', marginBottom: 1 }}
              onClick={() => {
                setFirstOpen(false)
                setSecondaryOpen([true, 'מדפים'])
                handleResetRotation()
              }}
            >
              מדפים
            </MenuItem>
            <MenuItem onClick={removeLastAction} sx={{ color: 'black', display: !isFirstOpen && 'none', marginBottom: 1 }}>
              בטל פעולה
            </MenuItem>
            <MenuItem
              sx={{ color: 'black', display: !isFirstOpen && 'none' }}
              onClick={async () => {
                console.log('cubes', cubes)
                console.log('shelfs', shelfs)
                console.log('joins', joins)
                await fetch(`http://localhost:5000/orders`, {
                  method: 'post',
                  body: JSON.stringify({ cubes: cubes, joins: joins, shelfs: shelfs }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                setCubes({
                  0: [],
                })
                joins.join3Exists = 0
                joins.join4Exists = 0
                joins.join5Exists = 0
                bars[1] = 0
                bars[2] = 0
                bars[3] = 0
                setShelfs([])
              }}
            >
              הזמן
            </MenuItem>
          </MenuList>
          {/* second menu item - display the user the cubes size and let him choose the required size */}
          <MenuItem sx={{ color: 'black', display: isSecondaryOpen[0] && isSecondaryOpen[1] === 'קוביות' ? 'block' : 'none' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CubeUi title="קוביות" newDraggingCube={newDraggingCube} closeSecondaryMenu={closeSecondaryMenu} />
            </Box>
          </MenuItem>
          {isSecondaryOpen[0] && isSecondaryOpen[1] === 'מדפים' && (
            <ShelfUi title={'מדפים'} addNewShelf={addNewShelf} closeSecondaryMenu={closeSecondaryMenu} />
          )}
        </Paper>
      </div>

      {message.messageType !== undefined && (
        <ModalMessage
          typeOfMessage={message.messageType}
          title={message.title}
          content={message.content}
          topPosition={message.topPosition}
          leftPosition={message.leftPosition}
          arrow={message.arrow}
          onCloseModal={closeModalMessage}
        />
      )}
      {!isModalOpen && (
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
            {!isDragging && !addDrawer && isSecondaryOpen[1] === undefined && (
              <OrbitControls ref={orbitControlsRef} enableZoom={false} maxPolarAngle={Math.PI} minPolarAngle={Math.PI / 2} />
            )}
            {Object.keys(cubes).map((key) =>
              cubes[key].map(
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
            {isDragging && <DraggingCube position={position} onDrag={handleDrag} url={`${size[0]}X${size[1]}`} size={size} />}

            {shelfs.map((shelf, index) => {
              return <GlassShelf key={index} position={shelf.position} xSize={shelf.xSize} />
            })}
            <Preload all />
          </Suspense>
        </Canvas>
      )}
      {addDrawer &&
        (() => {
          let indicator = 0

          const circles = Object.keys(cubes).flatMap((key) =>
            cubes[key].map((cube) => {
              if (cube.display) {
                const [isThereShelf, toPlace] = isShelf(Number(key), cube)
                if (!isThereShelf) {
                  indicator = 1
                  return (
                    <Circle
                      key={cube.position}
                      position={cube.position}
                      cubeSize={cube.size}
                      offset={cube.offset}
                      place={toPlace}
                      handleAddingShelf={handleAddingShelf}
                    />
                  )
                }
              }
              return null
            })
          )

          if (indicator === 0) {
            setAddDrawer(false)
            setIsMenu(true)
          }

          return circles
        })()}
      {isDragging && <Undo cancelLastAction={cancelDragging} />}
      {addDrawer && <Undo cancelLastAction={CancelAddingDrawer} />}
    </>
  )
}
