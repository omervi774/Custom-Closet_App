import React from 'react'
import { Button, Box } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const FileUpload = ({ handleFileChange, handleClose }) => {
  const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  return (
    <Box>
      <Button sx={{ marginRight: 40 }} variant="contained" onClick={handleClose}>
        להמשיך עם הרקע הדיפולטיבי
      </Button>
      <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        העלאת קובץ
        <VisuallyHiddenInput type="file" onChange={onFileChange} accept="image/*" />
      </Button>
    </Box>
  )
}

export default FileUpload
