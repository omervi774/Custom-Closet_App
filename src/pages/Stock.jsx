import React from "react";
import useData from "../useData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

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

  return (
    <div className="stock-management-container">
      <h1>Stock Management</h1>
      {/* <button onClick={handleAddItem} className="add-button">
        Add Item
      </button> */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockData &&
            stockData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    onClick={() => {
                      setOpen(true);
                      // setid(item.id);
                      id = item.id;
                    }}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  {/* <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="delete-button"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
            <TextField // TO BO CONTINIUED
              // id="outlined-controlled"
              label="new quantity"
              value={name}
              onChange={(event) => {
                console.log(event.target.value);
                setName(event.target.value);
              }}
              InputProps={{
                sx: { color: "black" },
              }}
            />

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
              submit
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* </div> */}
    </div>
  );
};

export default StockManagementPage;
