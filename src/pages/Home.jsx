import React from 'react'
import useData from '../useData'
import useUser from '../useUser'
// import { Button } from '@mui/material'
// import useEditData from '../useEditData'
// import FileUpload from '../components/FileUpload/FileUpload'
import AdminHome from '../components/HomePage/AdminHome'
import CustomerHome from '../components/HomePage/CustomerHome'

function Home() {
  const [data, setData] = useData('http://localhost:5000/homePage')
  // const [imgData, setImgData] = useData('http://localhost:5000/uploads')
  // const uploadFile = (file) => {
  //   setData((prev) => {
  //     return { ...prev, ['images']: [...prev['images'], file] }
  //   })
  // }
  // const [jsx, handleOpen] = useEditData('http://localhost:5000/homePage', setData, data, 'text_content')
  // const [jsx1, handleOpen1] = useEditData('http://localhost:5000/uploads', setData, data, 'images')
  const user = useUser()

  return (
    <>
      {data['text_content'] ? (
        user ? (
          <AdminHome data={data} setData={setData} />
        ) : (
          <CustomerHome data={data} />
        )
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>loading...</div>
      )}
      {/* {data['text_content'] ? (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
          <div style={{ backgroundColor: '#D3D3D3', padding: '50px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px' }}>{data['text_content'][3].subTitle}</h1>
              {user && (
                <Button
                  variant="contained"
                  sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                  onClick={() => {
                    handleOpen(data['text_content'][3].id, 'subTitle')
                  }}
                >
                  ערוך כותרת
                </Button>
              )}
              <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                {data['text_content'][1].subTitle}
              </p>
              {user && (
                <Button
                  variant="contained"
                  sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                  onClick={() => {
                    handleOpen(data['text_content'][1].id, 'subTitle')
                  }}
                >
                  ערוך טקסט
                </Button>
              )}
             
            </div>
          </div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>בינה מלאכותית</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][0].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data['text_content'][0].id, 'subTitle')
                    }}
                  >
                    ערוך טקסט
                  </Button>
                )}
              </div>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>התאמה אישית</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][4].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data['text_content'][4].id, 'subTitle')
                    }}
                  >
                    ערוך טקסט
                  </Button>
                )}
              </div>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>עיצוב ארון</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data['text_content'][2].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data['text_content'][2].id, 'subTitle')
                    }}
                  >
                    ערוך טקסט
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>גלריית תמונות</h2>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user && <FileUpload uploadFile={uploadFile} />}
                {data['images'] &&
                  data['images'].map((img, index) => {
                    return (
                      <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }} key={index}>
                        <img src={img.path} alt="Placeholder" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }} />
                        {img.price && <h4 style={{ marginBottom: '20px' }}>{img.price} : מחיר</h4>}
                        {user ? (
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
                        ) : null}
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
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>loading...</div>
      )} */}
    </>
  )
}

export default Home
