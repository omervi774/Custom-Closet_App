import React from "react";
import { Button,Card, CardContent, Typography, CardActions } from "@mui/material";


const CardStyle = {
  width: "15vw",
  margin: "auto",
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #e0e0e0", 
  color: "black", 
  textAlign: "center",
};

const ButtonStyle =
{
  borderRadius: "30px",
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
  textAlign: 'center' 
}




const StockCard = ({ quantity, name , id,handleOpen }) => {
  return (

    <Card style={CardStyle}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h6" component="div" style={{ fontWeight: "bold", marginBottom: 16 }}>
          {quantity} :כמות 
        </Typography>
      </CardContent>
      <CardActions   sx={{ justifyContent: 'center' }}>
      <Button style={ButtonStyle} onClick={() => { handleOpen(id) } }  variant="outlined" >
       ערוך כמות
      </Button  >
      
      </CardActions>
    </Card>

  );
};

export default StockCard;
