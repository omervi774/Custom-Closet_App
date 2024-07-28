import { useState } from 'react'
import { Button, Modal, TextField, Box } from '@mui/material'
let id = ''
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
export default function useEditData(url, setData, data, objKey, inputLabel) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [attributeName, setAttributeName] = useState('')
  const handleClose = () => {
    setOpen(false)
    //setid("");
    id = ''
    setAttributeName('')
  }

  const handleOpen = (itemId, itemName) => {
    // console.log(itemId)
    setOpen(true)
    //setid("");
    id = itemId
    setAttributeName(itemName)

    console.log(id)
    console.log(itemName)
  }
  const Jsx = () => {
    return (
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={async () => {
                console.log(`${url}/${id}`)
                setOpen(false)

                const body = JSON.stringify({ [attributeName]: name })
                console.log(body)
                const response = await fetch(`${url}/${id}`, {
                  method: 'PUT',
                  body: body,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                const result = await response.json()
                console.log(result)

                if (data instanceof Array) {
                  setData(
                    data.map((item) => {
                      if (item.id === id) {
                        return result
                      } else {
                        return item
                      }
                    })
                  )
                } else {
                  setData((prev) => {
                    return {
                      ...prev,
                      [objKey]: prev[objKey].map((item) => {
                        if (item.id === id) {
                          return result
                        } else {
                          return item
                        }
                      }),
                    }
                  })
                }
                setName('')
              }}
            >
              לאשר
            </Button>
            <TextField // TO BO CONTINIUED
              // id="outlined-controlled"
              label={inputLabel ? inputLabel : 'הזן כמות חדשה'}
              value={name}
              variant="filled"
              onChange={(event) => {
                console.log(event.target.value)
                setName(event.target.value)
              }}
              dir="rtl" // Set direction to right-to-left
              InputProps={{
                sx: { color: 'black' },
              }}
            />
          </Box>
        </Box>
      </Modal>
    )
  }
  return [Jsx, handleOpen]
}
