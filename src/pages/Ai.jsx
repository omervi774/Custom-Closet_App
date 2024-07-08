import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'
import { Preload, OrbitControls, Environment } from '@react-three/drei'
import Cube from '../components/Cube/Cube'
import { Button } from '@mui/material'
import useData from '../useData'
import TextSwap from '../components/TextSwap/TextSwap'
import { serverRoute } from '../components/consts/consts'

function Ai(props) {
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [data] = useData(`${serverRoute}/homePage`)

  const navigate = useNavigate()
  const [cubes, setCubes] = useState({
    '-1': [],
  })

  // Popup modal
  const [isModalOpen, setIsModalOpen] = useState(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleUserInput = (e) => {
    setUserInput(e.target.value)
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (userInput.trim() !== '') {
      try {
        // Set isTyping to true when sending message
        setIsTyping(true)
        // Add user message to chat messages state immediately
        setChatMessages((prevMessages) => [...prevMessages, { text: userInput, sender: 'user' }])

        // Clear user input
        setUserInput('')

        // Send user input to the server
        const response = await fetch(`${serverRoute}/ai`, {
          method: 'POST',
          body: JSON.stringify({ text: userInput }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Get the response from the server
        const responseData = await response.json()
        // if (responseData.text !== 'תשובתך לא הייתה בפורמט הנכון, רענן את הדף ונסה שוב בבקשה.') {
        //   setCubes(responseData.text)
        // }
        if (responseData.text !== 'תשובתך לא הייתה בפורמט הנכון, רענן את הדף ונסה שוב בבקשה.') {
          const transformedData = {}
          Object.keys(responseData.text).forEach((key) => {
            const newKey = parseInt(key) === 0 ? '-1' : parseInt(key) - 1
            transformedData[newKey] = responseData.text[key]
          })
          setCubes(transformedData)
          console.log(transformedData)
        }

        // Add ChatGPT response to chat messages state
        setChatMessages((prevMessages) => [...prevMessages, { text: responseData.text, sender: 'ai' }])

        // Set isTyping back to false after receiving response
        setIsTyping(false)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  // Add initial message from ChatGPT if chat is empty
  if (chatMessages.length === 0) {
    setChatMessages([
      {
        text: 'היי! אשמח לעזור לך בעיצוב הארון. כתוב לי את המידע הבא: רוחב הארון הרצוי וגובה הארון הרצוי, תודה',
        sender: 'ai',
      },
    ])
  }

  return (
    <>
      {cubes['-1'].length === 0 ? (
        <>
          {data && <TextSwap data={data['text_content']} />}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '800px', marginTop: '10px' }}>
              <div
                style={{
                  height: '350px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '10px',
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  direction: 'rtl',
                }}
              >
                {/* popup model */}
                {isModalOpen && (
                  <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>AI Assistent</h2>
                    <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                      לפניכם מערכת AI שנועדה לעזור לכם לעצב ארון. כתבו בתיבת הטקסט את גדלי הארון הרצויים והמערכת תדאג לעצב לכם ארון בגדלים
                      שביקשתם!
                    </p>
                  </Modal>
                )}

                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '5px',
                      textAlign: message.sender === 'ai' ? 'right' : 'left',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '21px',
                        margin: '7px',
                        backgroundColor: message.sender === 'ai' ? '#dff0d8' : '#d9edf7',
                        color: message.sender === 'ai' ? '#4CAF50' : '#337ab7',
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {/* Building indicator */}
                {isTyping && <div style={{ textAlign: 'right', fontStyle: 'italic' }}>...Building</div>}
              </div>
              <form onSubmit={handleSendMessage}>
                <div style={{ display: 'flex' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send
                  </button>
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInput}
                    style={{
                      flex: '1',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      marginLeft: '10px',
                      direction: 'rtl',
                      fontSize: '20px',
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
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

              <Preload all />
            </Suspense>
          </Canvas>
          <Button
            variant="contained"
            sx={{ position: 'absolute', top: '82%', left: '47%' }}
            onClick={() => navigate('/closetDesign', { state: { initalCubes: cubes } })}
          >
            {' '}
            המשך עם ארון זה
          </Button>
          <Button
            variant="contained"
            sx={{ position: 'absolute', top: '82%', left: '57%' }}
            onClick={async () => {
              const message = `please give me another design following the exact rules. User input: ${chatMessages[1].text}`

              const response = await fetch(`${serverRoute}/ai`, {
                method: 'POST',
                body: JSON.stringify({ text: message }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })

              if (!response.ok) {
                throw new Error('Network response was not ok')
              }

              // Get the response from the server
              const responseData = await response.json()
              const transformedData = {}
              Object.keys(responseData.text).forEach((key) => {
                const newKey = parseInt(key) === 0 ? '-1' : parseInt(key) - 1
                transformedData[newKey] = responseData.text[key]
              })
              setCubes(transformedData)
              console.log(transformedData)
            }}
          >
            {' '}
            נסה עיצוב נוסף
          </Button>
        </>
      )}
    </>
  )
}

export default Ai
