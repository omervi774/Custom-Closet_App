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
import CircularProgress from '@mui/material/CircularProgress'

function Ai(props) {
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [data] = useData(`${serverRoute}/homePage`)
  const [loading, setLoading] = useState(false)

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
        text: 'היי! אשמח לעזור לך בעיצוב הארון. כתוב לי את המידע הבא: רוחב הארון הרצוי וגובה הארון הרצוי, תודה :)',
        sender: 'ai',
      },
    ])
  }

  return (
    <>
      {cubes['-1'].length === 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'white', height: '100%' }}>
            <div style={{ width: '800px', marginTop: '100px' }}>
              <div
                style={{
                  height: '350px',
                  border: '1px solid #ccc',
                  borderRadius: '15px',
                  padding: '10px',
                  marginBottom: '10px',
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  backgroundImage: 'url(/whatapp_background.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  direction: 'rtl',
                }}
              >
                {/* popup model */}
                {isModalOpen && (
                  <Modal isOpen={isModalOpen} handleClose={handleCloseModal}>
                    <div style={{ padding: '20px', textAlign: 'right', fontFamily: 'calibri, sans-serif', color: '#333', width: '450px' }}>
                      <h2 style={{ textAlign: 'right', marginBottom: '20px', color: 'black' }}>סוכן חכם</h2>
                      <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                        ברוכים הבאים למערכת ה-AI שלנו, שנועדה לסייע לכם בעיצוב ארון מותאם אישית. כתבו בתיבת הטקסט את המידות הרצויות והמערכת
                        תיצור עבורכם עיצוב מושלם בהתאם לבקשותיכם!
                      </p>
                    </div>
                  </Modal>
                )}

                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '5px',
                      fontFamily: 'Cascadia Code, sans-serif',
                      textAlign: message.sender === 'ai' ? 'right' : 'right',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '18px',
                        fontFamily: 'Cascadia Code, sans-serif',
                        margin: '7px',
                        backgroundColor: message.sender === 'ai' ? '#dbffd1' : 'white',
                        color: message.sender === 'ai' ? 'black' : 'black',
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {/* Building indicator */}
                {isTyping && (
                  <div
                    style={{
                      backgroundColor: '#dbffd1',
                      color: 'black',
                      textAlign: 'right',
                      fontFamily: 'Cascadia Code, sans-serif',
                      fontSize: '18px',
                      margin: '5px',
                      marginTop: '10px',
                      display: 'inline-block',
                      padding: '5px',
                    }}
                  >
                    בונה ארון....
                  </div>
                )}
                {/* אני רוצה ארון בגובה 4 מטר וברוחב 3 מטר בבקשה */}
              </div>
              <form onSubmit={handleSendMessage}>
                <div style={{ display: 'flex' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '5px',
                      backgroundColor: '#5f7b8c',
                      color: '#f3efeb',
                      fontFamily: 'calibri, sans-serif',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    שלח
                  </button>
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInput}
                    style={{
                      flex: '1',
                      padding: '8px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontFamily: 'calibri, sans-serif',

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
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              alignContent: 'center',
              // backgroundColor: 'yellow',
              width: '90vw',
              // height: '75vh',
              // marginRight: '10%',
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px', // Adjust the gap between buttons as needed
              marginTop: '-150px', // Adjust the top margin as needed
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/closetDesign', { state: { initalCubes: cubes } })}
              sx={{
                padding: '8px 16px',
                borderRadius: '5px',
                backgroundColor: '#5f7b8c',
                color: '#f3efeb',
                fontFamily: 'calibri, sans-serif',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              המשך עם ארון זה
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                setLoading(true)
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

                const responseData = await response.json()
                const transformedData = {}
                Object.keys(responseData.text).forEach((key) => {
                  const newKey = parseInt(key) === 0 ? '-1' : parseInt(key) - 1
                  transformedData[newKey] = responseData.text[key]
                })
                setCubes(transformedData)
                console.log(transformedData)
                setLoading(false)
              }}
              disabled={loading}
              sx={{
                padding: '8px 16px',
                borderRadius: '5px',
                backgroundColor: '#5f7b8c',
                color: '#f3efeb',
                fontFamily: 'calibri, sans-serif',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'נסה עיצוב נוסף'}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default Ai
