import React from 'react'
import { Button } from '@mui/material'
import useEditData from '../../useEditData'
import FileUpload from '../FileUpload/FileUpload'
export default function AdminHome({ data, setData }) {
  const [jsx, handleOpen] = useEditData('http://localhost:5000/homePage', setData, data, 'text_content')
  const [jsx1, handleOpen1] = useEditData('http://localhost:5000/uploads', setData, data, 'images')
  const uploadFile = (file) => {
    setData((prev) => {
      return { ...prev, ['images']: [...prev['images'], file] }
    })
  }
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px' }}>{data['text_content'][1].title}</h1>

            <Button
              variant="contained"
              sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
              onClick={() => {
                handleOpen(data['text_content'][1].id, 'title')
              }}
            >
              ערוך כותרת
            </Button>

            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '20px' }}>{data['text_content'][1].subTitle}</p>

            <Button
              variant="contained"
              sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
              onClick={() => {
                handleOpen(data['text_content'][1].id, 'subTitle')
              }}
            >
              ערוך טקסט
            </Button>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}> {data['text_content'][0].title}</h2>
              <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][0].subTitle}</p>

              <Button
                variant="contained"
                sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                onClick={() => {
                  handleOpen(data['text_content'][0].id, 'subTitle')
                }}
              >
                ערוך טקסט
              </Button>
            </div>
            <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{data['text_content'][3].title} </h2>
              <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][3].subTitle}</p>

              <Button
                variant="contained"
                sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                onClick={() => {
                  handleOpen(data['text_content'][3].id, 'subTitle')
                }}
              >
                ערוך טקסט
              </Button>
            </div>
            <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{data['text_content'][2].title}</h2>
              <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][2].subTitle}</p>

              <Button
                variant="contained"
                sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                onClick={() => {
                  handleOpen(data['text_content'][2].id, 'subTitle')
                }}
              >
                ערוך טקסט
              </Button>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>גלריית תמונות</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <FileUpload uploadFile={uploadFile} />
              {data['images'] &&
                data['images'].map((img, index) => {
                  return (
                    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }} key={index}>
                      <img src={img.path} alt="Placeholder" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }} />
                      {img.price && <h4 style={{ marginBottom: '20px' }}>{img.price} : מחיר</h4>}

                      <>
                        {img.price ? (
                          <Button variant="contained" sx={{ marginBottom: '20px' }} onClick={() => handleOpen1(img.id, 'price')}>
                            ערוך מחיר
                          </Button>
                        ) : (
                          <Button Button variant="contained" sx={{ marginBottom: '20px' }} onClick={() => handleOpen1(img.id, 'price')}>
                            קבע מחיר
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="error"
                          onClick={async () => {
                            await fetch(`http://localhost:5000/uploads/${img.id}`, {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' },
                            })
                            setData((prev) => {
                              return {
                                ...prev,
                                images: prev['images'].filter((val) => {
                                  return val.id !== img.id
                                }),
                              }
                            })
                          }}
                        >
                          מחק תמונה
                        </Button>
                      </>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#007bff', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '30px', color: '#fff', marginBottom: '20px' }}> ?מוכנים להתחיל</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  backgroundColor: '#fff',
                  color: '#007bff',
                  padding: '10px 20px',
                  fontSize: '18px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                עיצוב ארון
              </button>
            </div>
          </div>
        </div>
        {jsx()}
        {jsx1()}
      </div>
    </>
  )
}
