import React from 'react'
import { Button, Card, CardContent, Typography, CardActions } from '@mui/material'

const CardStyle = {
  width: '15vw',
  margin: 'auto',
  marginBottom: 16,
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  color: 'black',
  textAlign: 'center',
}

const ButtonStyle = {
  borderRadius: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: 16,
}

const StockCard = ({ quantity, name, price, id, handleOpen }) => {
  return (
    <Card style={CardStyle}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h6" component="div" style={{ fontWeight: 'bold', marginBottom: 16 }}>
          {quantity} :כמות
        </Typography>
        <Button
          style={ButtonStyle}
          onClick={() => {
            handleOpen(id, 'quantity')
          }}
          variant="outlined"
        >
          ערוך כמות
        </Button>
        <Typography variant="h6" component="div" style={{ fontWeight: 'bold', marginBottom: 16 }}>
          {price} :מחיר
        </Typography>
        <Button
          style={ButtonStyle}
          onClick={() => {
            handleOpen(id, 'price')
          }}
          variant="outlined"
        >
          ערוך מחיר
        </Button>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}></CardActions>
    </Card>
  )
}

export default StockCard
