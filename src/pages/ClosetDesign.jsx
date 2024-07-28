import React, { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, OrbitControls, Environment } from '@react-three/drei'
import { MenuList, Box, Button } from '@mui/material'
import DraggingCube from '../components/DraggingCube/DraggingCube'
import Cube from '../components/Cube/Cube'
import Circle from '../components/Circle/Circle'
import CubeUi from '../components/CubeUi/CubeUi'
import ShelfUi from '../components/ShelfUi/ShelfUi'
import ModalMessage from '../components/ModalMessage/ModalMessage'
import Modal from '../components/Modal'
import Undo from '../components/Undo/Undo'
import FileUpload from '../components/FileUpload/FileUpload'
import { calculateJoins4Exists, calculateJoins3Exists, calculateJoins5Exists, calculateBars } from '../calculateJoins.js'
import { useLocation } from 'react-router-dom'
import { Shelf } from '../components/Shelf/Shelf.jsx'
import useData from '../useData'
import { v4 as uuidv4 } from 'uuid'
import { serverRoute } from '../components/consts/consts.js'
import { appRoute } from '../components/consts/consts.js'
import UserDetailsModal from '../components/UserDetailsModal/UserDetailsModal.jsx'
let url = ''
let lowProfileCode = ''
let shelfColor = ''
const globalOffset = 0.04
let closetRightEdge = 0
const lastActions = []
export default function ClosetDesign() {
  const location = useLocation()
  const { initalCubes } = location.state || {
    '-1': [],
  }
  const [barObject] = useData(`${serverRoute}/stocks/מוטות ברזל`)
  // for the dragging cube
  const [position, setPosition] = useState([-6, 1, 0])
  // this state responssible to store the possitions and sizes of all the cubes
  const [cubes, setCubes] = useState(() => {
    if (!initalCubes) {
      return {
        '-1': [],
      }
    } else {
      const closetRightCube = initalCubes['-1'][initalCubes['-1'].length - 1]
      closetRightEdge = closetRightCube.position[0] + closetRightCube.size[0] / 2
      return initalCubes
    }
  })
  // Popup modal when the use first enter the page for basic explanation about the essence of the page
  const [isModalOpen, setIsModalOpen] = useState(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setMessage({ messageType: 'success', title: 'התחל כאן', content: '', topPosition: '22.55%', leftPosition: '77.5%', arrow: true })
  }
  // modal for fill the user details
  const [detailsModal, setDetailsModal] = useState(false)
  const handleCloseDetailsModal = () => {
    setDetailsModal(false)
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
  const isFirstLayer = (layer) => {
    return layer === -1
  }
  const addingCubeToSide = (layer, positionToAddYAxis, cubeSize, xPosition, side) => {
    layer = Number(layer)
    const isLayer0 = isFirstLayer(layer)
    let offset = [0, 0]

    if (!isLayer0 || (isLayer0 && side === 'left')) {
      offset = calcOffsetWhenIsTopConnection(Number(layer), Number(layer) - 1, cubeSize, xPosition)
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
    setPosition([-6, 1, 0])
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
      title: '!חיבור חוקי',
      content: '',
      topPosition: '90%',
      leftPosition: '50%',
      arrow: false,
    })
    // setIsMenu(true)
  }
  const closeModalMessage = () => {
    setMessage({ messageType: undefined, title: '', content: '', topPosition: '', leftPosition: '', arrow: false })
    //setIsMenu(true)
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
    const rightEdge = xPosition + cubeSize[0] / 2
    return [(closetRightEdge - rightEdge) * globalOffset, (layer + 1) * globalOffset]
  }
  const handleDrag = (newPosition, cubeSize) => {
    setPosition(newPosition)
    const epsilon = 0.2
    const size = 1
    const layer = Math.floor(newPosition[1])

    if (layer < -1) {
      return
    }
    let positionToAddYAxis = 0
    if (cubeSize[1] === 2) {
      positionToAddYAxis = 0.5
    } else if (cubeSize[1] === 3) {
      positionToAddYAxis = 1
    }
    const buttomLayer = layer - 1
    if (buttomLayer >= -1 && cubes[buttomLayer]) {
      // check if the dragging cube connects from the top
      if (Math.abs(newPosition[1] - (buttomLayer + size)) < epsilon + positionToAddYAxis) {
        // check if there is a cube to connect to
        const [containsButtomCube, x] = is_include([newPosition[0], buttomLayer, 0], cubeSize[0], buttomLayer)
        // check if the new cube position has enough room on the new layer
        const isOverRide = isEnoughRoom(layer, x, cubeSize)
        if (isOverRide && containsButtomCube) {
          setMessage({
            messageType: 'error',
            title: 'חיבור לא חוקי',
            content: '',
            topPosition: '90%',
            leftPosition: '50%',
            arrow: false,
          })
        }
        if (!isOverRide && containsButtomCube && newPosition[1] + cubeSize[1] / 2 >= 4) {
          setMessage({
            messageType: 'error',
            title: 'חיבור לא חוקי',
            content: '',
            topPosition: '90%',
            leftPosition: '50%',
            arrow: false,
          })
        }

        if (containsButtomCube && !isOverRide && newPosition[1] + cubeSize[1] / 2 < 4) {
          const offset = calcOffsetWhenIsTopConnection(layer, buttomLayer, cubeSize, x)
          let i
          for (i = 0; i < cubeSize[1]; i++) {
            const indexToInsert = findCubeRoom(`${layer + i}`, x)
            const yPosition = i === 0 ? layer + positionToAddYAxis : i + layer
            const cubeAddingSize = i === 0 ? cubeSize : [cubeSize[0], 1]
            const display = i === 0 ? true : false
            if (indexToInsert === -1) {
              // in case the layer in new
              handleAddingCube(`${layer + i}`, [{ position: [x, yPosition, 0], size: cubeAddingSize, display: display, offset: offset }])
            } else if (indexToInsert === -2) {
              console.log(i)
              console.log(Number(layer))
              setMessage({
                messageType: 'error',
                title: 'חיבור לא חוקי',
                content: '',
                topPosition: '90%',
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
          setPosition([-6, 1, 0])
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
      const isLayer0 = isFirstLayer(layer)

      // check if the dragging cube is connecting from the left
      if (Math.abs(newPosition[0] + cubeSize[0] / 2 - leftEdge) < epsilon) {
        if (newPosition[0] + cubeSize[0] / 2 < -5.5 + epsilon) {
          setMessage({
            messageType: 'error',
            title: 'חיבור לא מצליח',
            content: '',
            topPosition: '90%',
            leftPosition: '50%',
            arrow: false,
          })
          return
        }
        if (isLayer0) {
          addingCubeToSide(layer.toString(), positionToAddYAxis, cubeSize, leftEdge - cubeSize[0] / 2, 'left')
          console.log('left')
          lastActions.push({ type: 'cube', layer: -1, position: [leftEdge - cubeSize[0] / 2, positionToAddYAxis], size: cubeSize })
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
          if (newPosition[0] + cubeSize[0] / 2 > 7.5 + epsilon) {
            setMessage({
              messageType: 'error',
              title: 'חיבור לא מצליח',
              content: '',
              topPosition: '90%',
              leftPosition: '50%',
              arrow: false,
            })
            return
          }
          addingCubeToSide(layer.toString(), positionToAddYAxis, cubeSize, rightEdge + cubeSize[0] / 2, 'right')
          console.log('right')
          lastActions.push({ type: 'cube', layer: -1, position: [rightEdge + cubeSize[0] / 2, positionToAddYAxis], size: cubeSize })
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
          closetRightEdge = rightEdge + cubeSize[0]
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
    if (cubes['-1'].length === 0) {
      let yOffset = 0
      if (height === 3) {
        yOffset = 1
      } else if (height === 2) {
        yOffset = 0.5
      }
      for (let i = 0; i < height; i++) {
        const yPosition = i === 0 ? -1 + yOffset : i - 1
        const cubeAddingSize = i === 0 ? [width, height] : [width, 1]

        const display = i === 0 ? true : false
        // in case the layer in new
        handleAddingCube(`${-1 + i}`, [{ position: [0, yPosition, 0], size: cubeAddingSize, display: display, offset: [0, 0] }])
      }
      lastActions.push({ type: 'cube', layer: -1, position: [0, yOffset], size: [width, height] })
      closetRightEdge = 0 + width / 2
      return
    } else {
      setPosition([-6, 1, 0])
      setIsDragging(true)
      setIsMenu(false)
    }
  }
  const addNewShelf = (material) => {
    console.log(material)
    shelfColor = material
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
        if (isFirstLayer(layer)) {
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
      return [...prev, { position: [xPosition, yPosition, 0], xSize: xSize, shelfColor: shelfColor }]
    })
    setMessage({
      messageType: 'success',
      title: 'המדף נוסף בהצלחה',
      content: '',
      topPosition: '90%',
      leftPosition: '50%',
      arrow: false,
    })
    setAddDrawer(false)
    setIsMenu(true)
  }
  const cancelDragging = () => {
    setIsDragging(false)
    setPosition([-6, 1, 0])
    setIsMenu(true)
  }
  const CancelAddingDrawer = () => {
    shelfColor = ''
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
          topPosition: '90%',
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
            if (newCubes['-1'] === undefined) {
              return { '-1': [] }
            }

            return newCubes
          })
          if (cubes['-1'].length === 0) {
            closetRightEdge = 0
          }
        }

        // checks if after remove the last cube that added if the right edge of the closet change
        // and if so update the offsets and the right edge of the closet
        setCubes((prev) => {
          const cubesCopy = JSON.parse(JSON.stringify(prev))
          if (cubesCopy['-1'].length > 0) {
            const closetRightCube = cubesCopy['-1'][cubesCopy['-1'].length - 1]
            const possibleClosetRightEdge = closetRightCube.position[0] + closetRightCube.size[0] / 2
            const offsetToSub = globalOffset * (closetRightEdge - possibleClosetRightEdge) * -1
            // in case the right edge of the closet change
            if (possibleClosetRightEdge !== closetRightEdge) {
              setShelfs((prev) => {
                return prev.map((shelf) => {
                  return {
                    ...shelf,
                    position: [shelf.position[0] + offsetToSub, shelf.position[1], shelf.position[2]],
                  }
                })
              })
              for (const key in cubesCopy) {
                cubesCopy[key] = cubesCopy[key].map((item) => {
                  if (item.position[0] + item.size[0] / 2 === possibleClosetRightEdge) {
                    // return the item with x offest of zero
                    return {
                      ...item,
                      offset: [0, item.offset[1]],
                    }
                  } else {
                    // update the offset
                    return {
                      ...item,
                      offset: [item.offset[0] + offsetToSub, item.offset[1]],
                    }
                  }
                })
              }
              console.log('copyCube ', cubesCopy)
              closetRightEdge = possibleClosetRightEdge
            }
            return cubesCopy
          } else {
            return prev
          }
        })

        setMessage({
          messageType: 'success',
          title: 'הקובייה הוסרה בהצלחה',
          content: '',
          arrow: false,
          topPosition: '90%',
          leftPosition: '50%',
        })
      }
    }
  }
  const submitDetailsModal = async (userDetails) => {
    const joins3Exists = calculateJoins3Exists(cubes)
    const joins4Exists = calculateJoins4Exists(cubes)
    const joins5Exists = calculateJoins5Exists(cubes)
    const barsUsed = calculateBars(cubes)
    await fetch(`${serverRoute}/orders`, {
      method: 'post',
      body: JSON.stringify({
        cubes: cubes,
        shelfs: shelfs,
        orderId: lowProfileCode,
        paid: false,
        userDetails: userDetails,
        joins3Exists: joins3Exists,
        joins4Exists: joins4Exists,
        joins5Exists: joins5Exists,
        bars: barsUsed,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setCubes({
      '-1': [],
    })
    setShelfs([])
    closetRightEdge = 0

    window.open(url, '_blank')
    handleCloseDetailsModal()
  }
  return (
    <>
      {/* popup modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
          <div style={{ padding: '20px', textAlign: 'right', fontFamily: 'calibri, sans-serif', color: '#333', width: '450px' }}>
            <h2 style={{ textAlign: 'right', marginBottom: '20px', color: 'black' }}>עיצוב ארון בהתאמה אישית</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              לפניכם עמוד בו תוכלו לגרור קוביות ולחברם לקוביות מהצד או מלמעלה ובכך לבנות ארון בהתאמה אישית
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
              :קודם כל ניתן לבחור תמונת רקע או להמשיך עם הרקע הדיפולטיבי
            </p>
          </div>

          {/* <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              .לפניכם עמוד בו תוכלו לגרור קוביות ולחברם לקוביות מהצד או מלמעלה ובכך לבנות ארון בהתאמה אישית
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
              :קודם כל ניתן לבחור תמונת רקע או להמשיך עם הרקע הדיפולטיבי
            </p>
          </div> */}
          <FileUpload handleFileChange={handleFileChange} handleClose={handleCloseModal} />
        </Modal>
      )}
      {detailsModal && <UserDetailsModal onSubmit={submitDetailsModal} open={detailsModal} onClose={handleCloseDetailsModal} />}

      {preview && (
        <div style={{ position: 'absolute' }}>
          <img src={preview} alt="Selected" style={{ maxWidth: '90%', height: 'auto' }} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: '10vh',
          zIndex: 1000,
          right: 0,
          textAlign: 'right',
          display: !isMenu && 'none',
          // display: 'flex',
          // justifyContent: 'flex-end',
          direction: 'rtl',
          height: '90vh',
        }}
      >
        <MenuList sx={{ textAlign: 'right', width: '20vh', marginTop: 5 }}>
          <Button
            variant="outlined"
            sx={{
              color: '#334055',
              fontFamily: 'Calibri, sans-serif',
              fontWeight: 'bold',
              display: !isFirstOpen && 'none',
              marginTop: 2.5,
              marginBottom: 1,
              marginRight: 6,
              textAlign: 'right',
              minWidth: '100%', // Ensure buttons are the same width
              borderColor: '#334055', // Grey border color
              // borderRadius: '10px', // Slightly rounded corners
              borderWidth: '1px', // Border width
              '&:hover': {
                borderColor: '#cad8e4', // Border color on hover
              },
              // margin: '8px 0', // Add margin between buttons
            }}
            onClick={() => {
              setFirstOpen(false)
              setSecondaryOpen([true, 'קוביות'])
              handleResetRotation()
            }}
          >
            הוסף קובייה
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: '#334055',
              fontFamily: 'Calibri, sans-serif',
              fontWeight: 'bold',
              display: !isFirstOpen && 'none',
              marginBottom: 1,
              marginRight: 6,
              textAlign: 'right',
              minWidth: '100%', // Ensure buttons are the same width
              borderColor: '#334055', // Grey border color
              // borderRadius: '10px', // Slightly rounded corners
              borderWidth: '1px', // Border width
              '&:hover': {
                borderColor: '#cad8e4', // Border color on hover
              },
              //margin: '8px 0', // Add margin between buttons
            }}
            onClick={() => {
              setFirstOpen(false)
              setSecondaryOpen([true, 'מדפים'])
              handleResetRotation()
            }}
          >
            הוסף מדף
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={removeLastAction}
            sx={{
              color: '#334055',
              fontFamily: 'Calibri, sans-serif',
              fontWeight: 'bold',
              display: !isFirstOpen && 'none',
              marginBottom: 1,
              marginRight: 6,
              textAlign: 'right',
              minWidth: '100%', // Ensure buttons are the same width
              borderColor: '#334055', // Grey border color
              // borderRadius: '10px', // Slightly rounded corners
              borderWidth: '1px', // Border width
              '&:hover': {
                borderColor: '#cad8e4', // Border color on hover
              },
              //margin: '8px 0', // Add margin between buttons
            }}
          >
            בטל פעולה
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              backgroundColor: '#5f7b8c',
              fontFamily: 'Calibri, sans-serif',
              fontWeight: 'bold',
              display: !isFirstOpen && 'none',
              textAlign: 'right',
              marginRight: 6,
              marginTop: 35,
              minWidth: '100%', // Ensure buttons are the same width
              borderColor: '#5f7b8c', // Grey border color
              // borderRadius: '10px', // Slightly rounded corners
              borderWidth: '1px', // Border width
              '&:hover': {
                backgroundColor: 'white', // Optional: Set a darker color for hover effect
                color: '#5f7b8c',
                borderColor: '#5f7b8c', // Grey border color
              },
              // margin: '8px 0', // Add margin between buttons
            }}
            onClick={async () => {
              if (cubes['-1'].length === 0) {
                setMessage({
                  messageType: 'error',
                  title: 'שגיאה לא ניתן לשלם ',
                  content: 'הסכום לתשלום חייב להיות גדול מ 0 ',
                  arrow: false,
                  topPosition: '20%',
                  leftPosition: '50%',
                })
                return
              }
              console.log('cubes', cubes)
              console.log('shelfs', shelfs)
              const uniqueId = uuidv4()
              console.log(uniqueId)

              const barsUsed = calculateBars(cubes)
              const priceOfOneBar = Number(barObject[0].price)
              const OrderPrice = priceOfOneBar * barsUsed
              console.log(OrderPrice)
              const formData = {
                Operation: '1', // Charge only
                TerminalNumber: '1000',
                UserName: 'test2025',
                SumToBill: OrderPrice.toString(),
                CoinId: '1', // Shekel
                Language: 'he',
                ProductName: 'ארון בהאתמה אישית',
                APILevel: '10',
                Codepage: '65001', // utf 8
                ReturnValue: uniqueId,
                // ShowCardOwnerPhone: true,
                // ReqCardOwnerPhone: true,
                // ShowCardOwnerEmail: true,
                // ReqCardOwnerEmail: true,
                IndicatorUrl: `${serverRoute}/payment-indicator`,
                SuccessRedirectUrl: `${appRoute}paymentSuccess`,
                ErrorRedirectUrl: `${appRoute}paymentFailure`,
                // Add more parameters as needed
              }

              try {
                const response = await fetch('https://secure.cardcom.solutions/Interface/LowProfile.aspx', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  },
                  body: new URLSearchParams(formData).toString(),
                })

                if (!response.ok) {
                  throw new Error('Network response was not ok')
                }

                const responseData = await response.text()
                console.log('Response from Cardcom API:', responseData)

                //decoding all 3 url to give to the clinet
                const params = new URLSearchParams(responseData)
                url = decodeURIComponent(params.get('url'))
                const paypalUrl = decodeURIComponent(params.get('PayPalUrl'))
                const bitUrl = decodeURIComponent(params.get('BitUrl'))
                lowProfileCode = decodeURIComponent(params.get('LowProfileCode'))
                setDetailsModal(true)

                console.log('Decoded URL:', url)
                console.log('Decoded PayPal URL:', paypalUrl)
                console.log('Decoded Bit URL:', bitUrl)
                console.log('Decoded low profile code:', lowProfileCode)

                // Process the response as needed
              } catch (error) {
                console.error('Error fetching data:', error)
                // Handle errors here
              }
            }}
          >
            הזמן
          </Button>
        </MenuList>
        <Box sx={{ color: 'black', display: isSecondaryOpen[0] && isSecondaryOpen[1] === 'קוביות' ? 'block' : 'none' }}>
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
        </Box>
        {isSecondaryOpen[0] && isSecondaryOpen[1] === 'מדפים' && (
          <ShelfUi title={'מדפים'} addNewShelf={addNewShelf} closeSecondaryMenu={closeSecondaryMenu} />
        )}
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
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            // backgroundColor: 'yellow',
            // width: '80vw',
            // height: '75vh',
            // marginLeft: '10%',
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
              // return <GlassShelf key={index} position={shelf.position} xSize={shelf.xSize} />
              return <Shelf key={index} position={shelf.position} xSize={shelf.xSize} url={shelf.shelfColor} />
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
