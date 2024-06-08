import React from 'react'
import useData from '../useData'
import useUser from '../useUser'
import { Button } from '@mui/material'
import useEditData from '../useEditData'

function Home() {
  const [data, setData] = useData('http://localhost:5000/homePage')
  const [jsx, handleOpen] = useEditData('http://localhost:5000/homePage', setData, data)
  const user = useUser()

  return (
    <>
      {data ? (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px' }}>{data[3].subTitle}</h1>
              {user && (
                <Button
                  variant="contained"
                  sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                  onClick={() => {
                    handleOpen(data[3].id, 'subTitle')
                  }}
                >
                  ערוך כותרת
                </Button>
              )}
              <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '20px' }}>{data[1].subTitle}</p>
              {user && (
                <Button
                  variant="contained"
                  sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                  onClick={() => {
                    handleOpen(data[1].id, 'subTitle')
                  }}
                >
                  ערוך טקסט
                </Button>
              )}
              {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Learn More
          </button>
        </div> */}
            </div>
          </div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>בינה מלאכותית</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data[0].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data[0].id, 'subTitle')
                    }}
                  >
                    ערוך טקסט
                  </Button>
                )}
              </div>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>התאמה אישית</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data[4].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data[4].id, 'subTitle')
                    }}
                  >
                    ערוך טקסט
                  </Button>
                )}
              </div>
              <div style={{ flex: '1', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>עיצוב ארון</h2>
                <p style={{ fontSize: '16px', color: '#666' }}>{data[2].subTitle}</p>
                {user && (
                  <Button
                    variant="contained"
                    sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}
                    onClick={() => {
                      handleOpen(data[2].id, 'subTitle')
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
                <div style={{ margin: '10px' }}>
                  <img
                    src="https://via.placeholder.com/200"
                    alt="Placeholder"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ margin: '10px' }}>
                  <img
                    src="https://via.placeholder.com/200"
                    alt="Placeholder"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ margin: '10px' }}>
                  <img
                    src="https://via.placeholder.com/200"
                    alt="Placeholder"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                  />
                </div>
                {/* Add more images here */}
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
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>loading...</div>
      )}
    </>
  )
}

export default Home
