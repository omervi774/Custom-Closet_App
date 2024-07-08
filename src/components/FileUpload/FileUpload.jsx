import React from 'react'
import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import { serverRoute } from '../consts/consts'

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

const FileUpload = ({ handleFileChange, handleClose, uploadFile }) => {
  // when the user picks file to upload
  const onFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      // in case the user picks back-ground img for the cube dragging
      if (handleFileChange) {
        handleFileChange(file)
      }
      // in case the admin user picks img to upload for the home page
      else if (uploadFile) {
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch(`${serverRoute}/upload_img`, {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()
          console.log(data.msg)
          uploadFile({ path: data.file, id: data.id })
        } catch (error) {
          console.error('There was an error uploading the file!', error)
        }
      }
    }
  }

  return (
    <>
      {handleFileChange ? (
        <>
          {' '}
          <Button sx={{ marginRight: 40 }} variant="contained" onClick={handleClose}>
            להמשיך עם הרקע הדיפולטיבי
          </Button>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            העלאת קובץ
            <VisuallyHiddenInput type="file" onChange={onFileChange} accept="image/*" />
          </Button>
        </>
      ) : (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          העלאת תמונה
          <VisuallyHiddenInput type="file" onChange={onFileChange} accept="image/*" />
        </Button>
      )}
    </>
  )
}

export default FileUpload
