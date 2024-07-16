import React, { useEffect } from 'react'
import { Box, Typography, Container } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import emailjs from '@emailjs/browser'

const PaymentSuccess = () => {
  useEffect(() => {
    // TODO - Need to check how to use the .env file!

    const serviceID = process.env.REACT_APP_SERVICE_ID
    const templateID = process.env.REACT_APP_TEMPLATE_ID
    const publicID = process.env.REACT_APP_PUBLIC_KEY

    if (!serviceID) {
      throw new Error('serviceID key not found in environment variables.')
    }
    if (!templateID) {
      throw new Error('templateID key not found in environment variables.')
    }
    if (!publicID) {
      throw new Error('publicID key not found in environment variables.')
    }

    // Check if needed
    const templateParams = {
      name: 'אורח',
    }

    // TODO - Need to check how to use the .env file!

    emailjs.send(serviceID, templateID, templateParams, publicID).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text)
      },
      (error) => {
        console.log('FAILED...', error)
      }
    )
  }, [])
  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" textAlign="center">
        <CheckCircleIcon style={{ fontSize: 80, color: 'green' }} />
        <Typography variant="h4" gutterBottom>
          !התשלום הצליח
        </Typography>
        <Typography variant="body1" gutterBottom>
          .תודה על הזמנתך. התשלום בוצע בהצלחה
        </Typography>
      </Box>
    </Container>
  )
}

export default PaymentSuccess
