import React from 'react'
import { Box, Typography, Container } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const PaymentFailure = () => {
  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" textAlign="center">
        <ErrorIcon style={{ fontSize: 80, color: 'red' }} />
        <Typography variant="h4" gutterBottom>
          התשלום נכשל
        </Typography>
        <Typography variant="body1" gutterBottom>
          .לצערנו, התשלום לא הצליח. אנא נסה שוב
        </Typography>
      </Box>
    </Container>
  )
}

export default PaymentFailure
