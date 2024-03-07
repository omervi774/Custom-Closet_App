import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Preload, OrbitControls } from "@react-three/drei";
import { Button } from "@mui/material";

// this component display 3D dragging cube on the screen
const DraggingCube = ({ position, onDrag }) => {
  const { scene } = useGLTF("cube/cabbinet.gltf");
  const [isDragging, setIsdragging] = useState(false);

  const startDrag = () => {
    setIsdragging(true);
  };
  const stopDrag = () => {
    setIsdragging(false);
  };
  const movement = (e) => {
    if (!isDragging) {
      return;
    }

    const { movementX, movementY } = e;
    console.log(position[0] + movementX);
    console.log(position[1] + movementY);
    onDrag([position[0] + movementX * 0.02, position[1] - movementY * 0.02, 0]);
  };

  return (
    <primitive
      onPointerDown={startDrag}
      onPointerMissed={stopDrag}
      onPointerMove={movement}
      object={scene.clone(true)}
      scale={0.5}
      position={position}
      rotation-y={0}
    />
  );
};

// this component display 3D static cube on the screen
const Cube = ({ position, onDrag }) => {
  const { scene } = useGLTF("cube/cabbinet.gltf");

  return (
    <primitive
      object={scene.clone(true)}
      scale={0.5}
      position={position}
      rotation-y={0}
    />
  );
};

export default function Home() {
  // for the dragging cube
  const [position, setPosition] = useState([-2, 2, 0]);
  // this state responssible to store the possitions of all the cubes
  const [cubes, setCubes] = useState({
    0: [[0, 0, 0]],
  });
  // this state responssible to check if the user try to drag new cube or not
  const [isDragging, setIsDragging] = useState(false);
  // when the user drags cube this trigger that func
  const handleDrag = (newPosition) => {
    setPosition(newPosition);
    const epsilon = 0.1;
    const size = 1;
    // for each key of our layers check if the dragging cube connects to the layer from the left/right
    Object.keys(cubes).forEach((layer) => {
      const minX = cubes[layer][0][0]; // min possition of the layer
      const maxX = cubes[layer][cubes[layer].length - 1][0]; // max possition of the layer

      if (Math.abs(newPosition[1] - layer) < epsilon) {
        // check if the dragging cube is in the same height of the layer
        if (Math.abs(newPosition[0] + size - minX) < epsilon) {
          // check if the dragging cube is connecting from the left
          setCubes((prev) => {
            return {
              ...prev,
              [layer]: [[minX - size, Number(layer), 0], ...cubes[layer]],
            };
          });
          setIsDragging(false);
          setPosition([-2, 2, 0]);
        } else if (Math.abs(newPosition[0] - size - maxX) < epsilon) {
          // check if the dragging cube is connecting from the right
          setCubes((prev) => {
            return {
              ...prev,
              [layer]: [...cubes[layer], [maxX + size, Number(layer), 0]],
            };
          });
          setIsDragging(false);
          setPosition([-2, 2, 0]);
        }
      }
    });
  };
  return (
    <>
      <Button
        color="success"
        variant="contained"
        onClick={() => {
          setIsDragging(true);
        }}
        sx={{ color: "white" }}
      >
        הוסף קובייה
      </Button>
      <Canvas
        shadows
        //frameloop="always"
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        <Suspense fallback={null}>
          {!isDragging && (
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          {Object.keys(cubes).map((key) =>
            cubes[key].map((cube, index) => (
              <Cube key={index} position={cube} />
            ))
          )}

          {isDragging && (
            <DraggingCube position={position} onDrag={handleDrag} />
          )}
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
}
