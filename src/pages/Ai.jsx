import React, { useState } from 'react'

function Ai(props) {
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

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
        const response = await fetch('http://localhost:5000/ai', {
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
        text: 'היי, אשמח לעזור לך בעיצוב הארון. אשמח אם תוכל לכתוב לי את המידע הבא: אורך הארון, רוחב הארון, גובה הארון צבע הארון ומספר המדפים אותו תרצה, תודה',
        sender: 'ai',
      },
    ])
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '800px', marginTop: '40px' }}>
        <div
          style={{
            height: '450px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
            direction: 'rtl',
          }}
        >
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
          {/* Typing indicator */}
          {isTyping && <div style={{ textAlign: 'right', fontStyle: 'italic' }}>Typing...</div>}
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
  )
}

export default Ai
