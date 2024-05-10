import React from 'react'

const modalStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}

const contentStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.75)',
  maxWidth: '80%',
}

const closeStyle = {
  color: '#aaa',
  float: 'right',
  fontSize: '24px',
  cursor: 'pointer',
}

const Modal = ({ isOpen, handleClose, children }) => {
  return (
    <>
      {isOpen && (
        <div style={modalStyle}>
          <div style={contentStyle}>
            <span style={closeStyle} onClick={handleClose}>
              &times;
            </span>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
