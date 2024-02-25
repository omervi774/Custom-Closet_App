import React from "react";
import useData from "../useData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";

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

const StockManagementPage = () => {
  const stockData = useData("http://localhost:5000/stocks");
  const [id, setid] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setid("");
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
                      setid(item.id);
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
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              PITER ZONA!!!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Omer hazain.
            </Typography>

            <TextField // TO BO CONTINIUED
              // id="outlined-controlled"
              label="Controlled"
              value={name}
              onChange={(event) => {
                console.log(event.target.value);
                setName(event.target.value);
              }}
            />

            <button
              type="submit"
              // className="Submit-button"
              endIcon={<SendIcon />}
            >
              Submit
            </button>
          </Box>

          {/* onSubmit={(e) => {
              e.preventDefault();
              console.log("delete");
            }}
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off" */}
        </Modal>
      </div>
    </div>
  );
};

export default StockManagementPage;
