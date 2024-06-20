// return cube from the layer with the right/left (depend on the side param) edge as the edge param (if cube exsists)
// otherwise return -1
const findCube = (layer, edge, side, cubes) => {
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
const heightRatio = (testedCube, CubeFromItsSide, numerLayer, cubes) => {
  const testedCubeHeight = testedCube.position[1] + testedCube.size[1] / 2
  const testedCubeRightEdge = testedCube.position[0] + testedCube.size[0] / 2
  const sideCubeHeight = CubeFromItsSide.position[1] + CubeFromItsSide.size[1] / 2
  if (testedCubeHeight > sideCubeHeight) {
    return 'higher'
  } else if (sideCubeHeight > testedCubeHeight) {
    return 'lower'
  } else if (sideCubeHeight === testedCubeHeight) {
    const indexCubeAboveLeft = findCube(numerLayer + testedCube.size[1], testedCubeRightEdge, 'left', cubes)
    const indexCubeAbove = findCube(numerLayer + testedCube.size[1], testedCubeRightEdge, 'right', cubes)
    if (CubeFromItsSide.display === false) {
      if (indexCubeAboveLeft !== -1) {
        const cubeAbove = cubes[numerLayer + testedCube.size[1]][indexCubeAboveLeft]
        if (cubeAbove.display === false) {
          return 'lower'
        }
        if (indexCubeAboveLeft !== -1 && indexCubeAbove !== -1) {
          return 'cubes above from both'
        }
        return 'equal and cube above to cube from side'
      } else if (indexCubeAbove !== -1) {
        return 'equal and cube above'
      }
      return 'equal'
    } else {
      if (indexCubeAboveLeft !== -1 && indexCubeAbove !== -1) {
        return 'cubes above from both'
      } else if (indexCubeAboveLeft !== -1) {
        return 'equal and cube above to cube from side'
      } else if (indexCubeAbove !== -1) {
        return 'equal and cube above'
      } else {
        return 'equal'
      }
    }
  }
}
export const calculateJoins5Exists = (cubes) => {
  let join5Exists = 0
  Object.keys(cubes).forEach((layer) => {
    const numberLayer = Number(layer)
    const cubeLayerCollection = cubes[layer]
    for (let i = 0; i < cubeLayerCollection.length; i++) {
      let count = 0
      const testedCube = cubeLayerCollection[i]
      if (testedCube.display) {
        const cubeLeftEdge = testedCube.position[0] - testedCube.size[0] / 2
        const cubeRightEdge = testedCube.position[0] + testedCube.size[0] / 2
        const cubeHeight = testedCube.position[1] + testedCube.size[1] / 2
        for (let j = numberLayer; j < numberLayer + testedCube.size[1]; j++) {
          const indexOfPossibleCubeFromLeft = findCube(j, cubeLeftEdge, 'right', cubes)
          // no cube from left -> continiue
          if (indexOfPossibleCubeFromLeft === -1) {
            break
          }
          const cubeFromLeft = cubes[j][indexOfPossibleCubeFromLeft]
          const cubeFromLeftHeight = cubeFromLeft.position[1] + cubeFromLeft.size[1] / 2
          if (cubeHeight === cubeFromLeftHeight) {
            // in case the the cubes height equal if the side cube disaply is false and also the one above than
            // the tested cube is lower -> continiue
            if (cubeFromLeft.display === false) {
              const index = findCube(j + 1, cubeLeftEdge, 'right', cubes)
              if (index !== -1) {
                if (cubes[j + 1][index].display === false) {
                  break
                }
              }
            }
            // in case there is a cube from left and a cube above the cube from left -> continiue
            if (findCube(j + 1, cubeLeftEdge, 'right', cubes) !== -1) {
              break
            }
            // in case ther is cube above the tested cube + cube from left
            else if (findCube(j + 1, cubeLeftEdge, 'left', cubes) !== -1) {
              count += 2
            }
            break
          }
        }
        for (let j = numberLayer; j < numberLayer + testedCube.size[1]; j++) {
          const indexOfPossibleCubeFromRight = findCube(j, cubeRightEdge, 'left', cubes)
          // no cube from left -> continiue
          if (indexOfPossibleCubeFromRight === -1) {
            break
          }
          const cubeFromRight = cubes[j][indexOfPossibleCubeFromRight]
          const cubeFromRightHeight = cubeFromRight.position[1] + cubeFromRight.size[1] / 2
          // in case the height are equal
          if (cubeHeight === cubeFromRightHeight) {
            // in case the the cubes height equal if the side cube disaply is false and also the one above than
            // the tested cube is lower -> continiue
            if (cubeFromRight.display === false) {
              const index = findCube(j + 1, cubeRightEdge, 'left', cubes)
              if (index !== -1) {
                if (cubes[j + 1][index].display === false) {
                  break
                }
              }
            }
            // in case there is a cube from right and a cube above the cube from right
            if (findCube(j + 1, cubeRightEdge, 'right', cubes) !== -1) {
              count += 2
              break
            }
            break
          }
        }
        join5Exists += count
        console.log(count, testedCube)
      }
    }
  })
  console.log('finish calculate joint 5 exists : ', join5Exists)
}
export const calculateJoins4Exists = (cubes) => {
  let joins4Exists = 0
  Object.keys(cubes).forEach((layer) => {
    const numberLayer = Number(layer)
    const cubeLayerCollection = cubes[layer]
    for (let i = 0; i < cubeLayerCollection.length; i++) {
      let count = 0
      const testedCube = cubeLayerCollection[i]
      if (testedCube.display) {
        const cubeLeftEdge = testedCube.position[0] - testedCube.size[0] / 2
        const cubeRightEdge = testedCube.position[0] + testedCube.size[0] / 2
        // checks if the tested cube has no cube from the left and no cube from the left in layer bellow
        // also if it short in the right side
        if (numberLayer !== 0) {
          const isTestedCubeShorterLeft = findCube(numberLayer - 1, cubeLeftEdge, 'left', cubes)
          const isTestedCubeShorterRight = findCube(numberLayer - 1, cubeRightEdge, 'right', cubes)
          if (isTestedCubeShorterRight === -1) {
            count += 2
          }
          // if it is not the first cube in the layer need to check that
          // there are no cube from left in the layer and also layer bellow
          if (i > 0) {
            const possibleCubeFromLeft = cubeLayerCollection[i - 1]
            const rightEdge = possibleCubeFromLeft.position[0] + possibleCubeFromLeft.size[0] / 2
            if (rightEdge !== cubeLeftEdge) {
              const isCubeFromLeftBellow = findCube(numberLayer - 1, cubeLeftEdge, 'right', cubes)
              if (isCubeFromLeftBellow === -1 || isTestedCubeShorterLeft === -1) {
                count += 2
              }
            }
          }
          // if it is the first cube in the layer need to check that
          // there is no cube from left just in the layer bellow
          else {
            const isCubeFromLeftBellow = findCube(numberLayer - 1, cubeLeftEdge, 'right', cubes)
            if (isCubeFromLeftBellow === -1 || isTestedCubeShorterLeft === -1) {
              count += 2
            }
          }
        }

        // find all the cubes from right to the tested cube (can be 0,1 or more, depnding on the cube height)
        // and update count depnding on the heghtRation and the layer (in layer 0 needs to add 2 more )
        for (let j = numberLayer; j < numberLayer + testedCube.size[1]; j++) {
          const indexCubeFromRight = findCube(j, cubeRightEdge, 'left', cubes)
          // if the tested cube has cube from the right
          if (indexCubeFromRight !== -1) {
            const cubeFromRight = cubes[j][indexCubeFromRight]
            const heightComparation = heightRatio(testedCube, cubeFromRight, numberLayer, cubes)
            const cubeFromRightHeight = cubeFromRight.position[1] + cubeFromRight.size[1] / 2
            // if the tested cube is higher and the layer is 0 add 4 if layer no 0 add 2
            // and run find cube for another iteration
            if (heightComparation === 'higher') {
              if (cubeFromRightHeight < 1) {
                count += 4
              } else {
                count += 2
              }
            }
            // if the tested cube is equal/lower and if its layer 0 add 4 joins if above layer 0 add 2
            // and continiue for the next cube
            else if (heightComparation === 'equal' || heightComparation === 'lower') {
              if (j === 0) {
                count += 4
              } else {
                count += 2
              }
              break
            }
            // if the tested cube is equal and cube above and if its layer 0 add 2 joins
            // and continiue for the next cube
            else {
              if (j === 0) {
                count += 2
              }
              break
            }
          }
          // in case the tested cube has no cube from the right
          // if it in nont layer 0 check if the cube has no cube from the right in the layer bellow
          // and if so add 2 more joins
          else {
            if (j === numberLayer && numberLayer !== 0) {
              const isCubeFromRightBellow = findCube(numberLayer - 1, cubeRightEdge, 'left', cubes)
              if (isCubeFromRightBellow === -1) {
                count += 2
              }
            }
            break
          }
        }
        joins4Exists += count
        console.log(count, testedCube)
      }
    }
  })
  console.log('after finsih calac joins 4 exists is :', joins4Exists)
}
export const calculateJoins3Exists = (cubes) => {
  let join3Exists = 4
  Object.keys(cubes).forEach((layer) => {
    const numberLayer = Number(layer)
    const cubeLayerCollection = cubes[layer]
    for (let i = 0; i < cubeLayerCollection.length; i++) {
      let count = 0
      const testedCube = cubeLayerCollection[i]
      if (testedCube.display) {
        const cubeLeftEdge = testedCube.position[0] - testedCube.size[0] / 2
        const cubeRightEdge = testedCube.position[0] + testedCube.size[0] / 2
        const isNoCubeFromRight = findCube(numberLayer + testedCube.size[1] - 1, cubeRightEdge, 'left', cubes) === -1
        const isNoCubeAboveRight = findCube(numberLayer + testedCube.size[1], cubeRightEdge, 'right', cubes) === -1
        const isNoCubeFromLeft = findCube(numberLayer + testedCube.size[1] - 1, cubeLeftEdge, 'right', cubes) === -1
        const isNoCubeAboveLeft = findCube(numberLayer + testedCube.size[1], cubeLeftEdge, 'left', cubes) === -1
        if (isNoCubeAboveRight && isNoCubeFromRight) {
          count += 2
        }
        if (isNoCubeFromLeft && isNoCubeAboveLeft) {
          count += 2
        }
      }
      join3Exists += count
    }
  })
  console.log('after finish calc joins 3 exists : ', join3Exists)
}
