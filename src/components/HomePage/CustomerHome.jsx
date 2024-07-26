import React, { useState } from 'react'
import TextSwap from '../TextSwap/TextSwap'
import { Button } from '@mui/material'
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal'
import { serverRoute } from '../consts/consts'
import { useNavigate } from 'react-router-dom'
let url = ''
let lowProfileCode = ''
let orderImgPath = ''

export default function CustomerHome({ data }) {
  console.log(data['text_content'])
  const [detailsModal, setDetailsModal] = useState(false)
  const navigate = useNavigate()

  const handleCloseDetailsModal = () => {
    setDetailsModal(false)
  }

  const handleOrder = async (price, path) => {
    const formData = {
      Operation: '1', // Charge only
      TerminalNumber: '1000',
      UserName: 'test2025',
      SumToBill: price,
      CoinId: '1', // Shekel
      Language: 'he',
      ProductName: 'ארון בהאתמה אישית',
      APILevel: '10',
      Codepage: '65001', // utf 8
      IndicatorUrl: `${serverRoute}/payment-indicator`,
      SuccessRedirectUrl: `${serverRoute}/pyament-success`,
      ErrorRedirectUrl: `${serverRoute}/pyament-error`,
      // Add more parameters as needed
    }
    try {
      const response = await fetch('https://secure.cardcom.solutions/Interface/LowProfile.aspx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams(formData).toString(),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const responseData = await response.text()
      console.log('Response from Cardcom API:', responseData)

      // decoding all 3 urls to give to the client
      const params = new URLSearchParams(responseData)
      orderImgPath = path
      url = decodeURIComponent(params.get('url'))
      const paypalUrl = decodeURIComponent(params.get('PayPalUrl'))
      const bitUrl = decodeURIComponent(params.get('BitUrl'))
      lowProfileCode = decodeURIComponent(params.get('LowProfileCode'))
      setDetailsModal(true)

      console.log('Decoded URL:', url)
      console.log('Decoded PayPal URL:', paypalUrl)
      console.log('Decoded Bit URL:', bitUrl)
      console.log('Decoded low profile code:', lowProfileCode)

      // Process the response as needed
    } catch (error) {
      console.error('Error fetching data:', error)
      // Handle errors here
    }
  }

  const submittingOrder = async (userDetails) => {
    await fetch(`${serverRoute}/orders`, {
      method: 'post',
      body: JSON.stringify({ path: orderImgPath, orderId: lowProfileCode, paid: false, userDetails: userDetails }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    window.open(url, '_blank')
    // url = ''
    // lowProfileCode = ''
    setDetailsModal(false)
  }

  return (
    <>
      {detailsModal && <UserDetailsModal onSubmit={submittingOrder} open={detailsModal} onClose={handleCloseDetailsModal} />}
      <div style={{ fontFamily: 'Calibri, sans-serif' }}>
        <TextSwap
          data={data['text_content'].filter((val, index) => {
            return index !== 1
          })}
        />
        <div>
          <h1 style={{ textAlign: 'center', fontSize: '26px', marginBottom: '20px' }}>{data['text_content'][1].title}</h1>
          <p style={{ textAlign: 'center', fontSize: '18px', color: 'black', marginBottom: '20px' }}>{data['text_content'][1].subTitle}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>המוצרים שלנו</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {data['images'] &&
                data['images'].map((img, index) => {
                  return (
                    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }} key={index}>
                      <img src={img.path} alt="Placeholder" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }} />
                      {img.price && (
                        <>
                          <h4 style={{ marginBottom: '20px', direction: 'rtl', textAlign: 'right' }}>מחיר: {img.price} ש"ח</h4>
                          <Button
                            variant="outlined"
                            onClick={() => handleOrder(img.price, img.path)}
                            sx={{
                              color: '#334055', // Text color
                              borderColor: '#334055', // Border color
                              '&:hover': {
                                borderColor: '#cad8e4', // Border color on hover
                              },
                            }}
                          >
                            הזמן עכשיו
                          </Button>
                        </>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#5f7b8c', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '30px', color: '#f3efeb', marginBottom: '20px' }}> ?מוכנים להתחיל</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  navigate('/closetDesign')
                }}
                style={{
                  backgroundColor: '#f3efeb',
                  color: '#5f7b8c',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  fontSize: '18px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Calibri, sans-serif',
                }}
              >
                עיצוב ארון
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
