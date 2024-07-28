import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const UserDetailsModal = ({ onSubmit, open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    let tempErrors = { ...errors }

    if (name === 'name') tempErrors.name = value ? false : true
    if (name === 'phone') tempErrors.phone = /^\d+$/.test(value) ? false : true
    if (name === 'email') tempErrors.email = /\S+@\S+\.\S+/.test(value) ? false : true
    if (name === 'address') tempErrors.address = value ? false : true
    if (name === 'city') tempErrors.city = value ? false : true

    setErrors(tempErrors)
  }

  const validate = () => {
    let tempErrors = {}
    if (!formData.name) tempErrors.name = true
    if (!formData.phone || !/^\d+$/.test(formData.phone)) tempErrors.phone = true
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = true
    if (!formData.address) tempErrors.address = true
    if (!formData.city) tempErrors.city = true
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData)
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }

  const titleStyle = {
    direction: 'rtl',
    textAlign: 'right',
    fontWeight: 'bold',
  }

  const closeButtonStyle = {
    alignSelf: 'flex-end',
  }

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <IconButton aria-label="close" onClick={onClose} sx={closeButtonStyle}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={titleStyle}>
            פרטי תקשורת
          </Typography>
          <TextField
            name="name"
            label="שם"
            placeholder="שם"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            variant="filled"
            helperText={errors.name ? 'שדה זה חובה' : ''}
            sx={{
              textAlign: 'right',
              '& .MuiInputBase-input': {
                color: 'black', // Set input text color to black
                textAlign: 'right', // Align input text to the right
                direction: 'rtl', // Ensure cursor moves correctly
              },
              '& label': {
                right: 20,
                left: 'auto',
                transformOrigin: 'right',
              },
              '& .MuiFormHelperText-root': {
                textAlign: 'right', // Align error message to the right
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
                '& fieldset': {
                  borderColor: errors.username ? 'red' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <TextField
            name="phone"
            label="מספר טלפון"
            placeholder="מספר טלפון"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            helperText={errors.phone ? 'מספר הטלפון אינו תקין' : ''}
            variant="filled"
            sx={{
              textAlign: 'right',
              '& .MuiInputBase-input': {
                color: 'black', // Set input text color to black
              },
              '& label': {
                right: 20,
                left: 'auto',
                transformOrigin: 'right',
              },
              '& .MuiFormHelperText-root': {
                textAlign: 'right', // Align error message to the right
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
                '& fieldset': {
                  borderColor: errors.phone ? 'red' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <TextField
            name="email"
            label="כתובת אימייל"
            placeholder="כתובת אימייל"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            helperText={errors.email ? 'כתובת האימייל אינה חוקית' : ''}
            variant="filled"
            sx={{
              textAlign: 'right',
              '& label': {
                right: 20,
                left: 'auto',
                transformOrigin: 'right',
              },
              '& .MuiInputBase-input': {
                color: 'black', // Set input text color to black
              },
              '& .MuiFormHelperText-root': {
                textAlign: 'right', // Align error message to the right
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
                '& fieldset': {
                  borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <TextField
            name="address"
            label="כתובת"
            placeholder="כתובת"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            variant="filled"
            helperText={errors.address ? 'שדה זה חובה' : ''}
            sx={{
              textAlign: 'right',
              '& .MuiInputBase-input': {
                color: 'black', // Set input text color to black
                textAlign: 'right', // Align input text to the right
                direction: 'rtl', // Ensure cursor moves correctly
              },
              '& label': {
                right: 20,
                left: 'auto',
                transformOrigin: 'right',
              },
              '& .MuiFormHelperText-root': {
                textAlign: 'right', // Align error message to the right
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
                '& fieldset': {
                  borderColor: errors.address ? 'red' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <TextField
            name="city"
            label="עיר"
            placeholder="עיר"
            fullWidth
            margin="normal"
            value={formData.city}
            onChange={handleChange}
            variant="filled"
            error={errors.city}
            helperText={errors.city ? 'שדה זה חובה' : ''}
            sx={{
              textAlign: 'right',
              '& label': {
                right: 20,
                left: 'auto',
                transformOrigin: 'right',
              },
              '& .MuiInputBase-input': {
                color: 'black', // Set input text color to black
                textAlign: 'right', // Align input text to the right
                direction: 'rtl', // Ensure cursor moves correctly
              },
              '& .MuiFormHelperText-root': {
                textAlign: 'right', // Align error message to the right
              },
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
                '& fieldset': {
                  borderColor: errors.city ? 'red' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              color: 'white',
              backgroundColor: '#5f7b8c',
              fontFamily: 'Calibri, sans-serif',
              fontWeight: 'bold',
              // display: !isFirstOpen && 'none',
              textAlign: 'right',
              // marginRight: 6,
              // marginTop: 35,
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
            fullWidth
            onClick={handleSubmit}
          >
            מעבר לדף תשלום
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default UserDetailsModal
