import React from 'react'
import TextSwap from '../TextSwap/TextSwap'

export default function CustomerHome({ data }) {
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <TextSwap data={data['text_content']} />
        {/* <div className="gallery-container">
          <div className="gallery-flex">
            {data['images'] &&
              data['images']
                .filter((val) => val.main === true)
                .map((img, index) => (
                  <div className="image-container" key={index}>
                    <img src={img.path} alt="Placeholder" className="responsive-image" />
                    {/* {img.price && <h4>{img.price} : מחיר</h4>} */}
        {/* </div> */}
        {/* ))} */} */
        {/* </div> */}
        {/* </div> */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '30px', marginBottom: '20px' }}>גלריית תמונות</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {data['images'] &&
                data['images'].map((img, index) => {
                  return (
                    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column' }} key={index}>
                      <img src={img.path} alt="Placeholder" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }} />
                      {img.price && <h4 style={{ marginBottom: '20px' }}>{img.price} : מחיר</h4>}
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
      </div>
    </>
  )
}
