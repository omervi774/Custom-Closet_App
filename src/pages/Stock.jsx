import React from "react";
import useData from "../useData";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import StockCard from "../components/StockCard/StockCard";


const TitleStyle = {
  textAlign: "center",
}

const ConstiarCardStyle =  {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  paddingTop: "5%",
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
let id = "";
const StockManagementPage = () => {
  const [stockData, setStockData] = useData("http://localhost:5000/stocks");
  // const [id, setid] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    //setid("");
    id = "";
  };
  
  const handleOpen = (itemId) => {
    setOpen(true);
    //setid("");
    id = itemId;
  };

  return (
    <div className="stock-management-container">
      <h1 style={TitleStyle}>ניהול מלאי</h1>
      {/* <button onClick={handleAddItem} className="add-button">
        Add Item
      </button> */}
        
        <div style={ConstiarCardStyle} >
          {stockData &&
            stockData.map((item, index) => (
              
          
                <StockCard key={index} name={item.name} quantity={item.quantity} id = {item.id} handleOpen = {handleOpen} />
           
       
            
                  // <button
                  //   onClick={() => {
                  //     setOpen(true);
                  //     // setid(item.id);
                  //     id = item.id;
                  //   }}
                  //   className="edit-button"
                  // >
                  //   Edit
                  // </button>
                  // {/* <button
                  //   onClick={() => handleDeleteItem(item.id)}
                  //   className="delete-button"
                  // >
                  //   Delete
                  // </button> */}
          
            ))} 
            </div>
     
      {/* <div> */}
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

          
          

            <Button
              variant="contained"
              onClick={async () => {
                setOpen(false);
                const response = await fetch(
                  `http://localhost:5000/stocks/${id}`,
                  {
                    method: "PUT",
                    body: JSON.stringify({ quantity: Number(name) }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                const result = await response.json();
                console.log(result);
                setStockData(
                  stockData.map((item) => {
                    if (item.id === id) {
                      return result;
                    } else {
                      return item;
                    }
                  })
                );
              }}
            >
              לאשר
            </Button>
            <TextField // TO BO CONTINIUED
              // id="outlined-controlled"
              label="הזן כמות חדשה" 
              value={name}
              variant="filled"
              onChange={(event) => {
                console.log(event.target.value);
                setName(event.target.value);
              }}
              dir="rtl" // Set direction to right-to-left
              InputProps={{
                sx: { color: "black" },
              }}
            />
          </Box>
        </Box>
      </Modal>
      {/* </div> */}
    </div>
  );
};

export default StockManagementPage;
