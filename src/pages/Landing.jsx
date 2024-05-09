import React from 'react'

function Landing(props) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#f5f5f5', padding: '50px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px' }}>Welcome to Our Business</h1>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginBottom: '40px' }}>
            Where quality meets innovation
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ flex: '1', padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>בינה מלאכותית</h2>
            <p style={{ fontSize: '16px', color: '#666' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div style={{ flex: '1', padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>התאמה אישית</h2>
            <p style={{ fontSize: '16px', color: '#666' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div style={{ flex: '1', padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>עיצוב ארון</h2>
            <p style={{ fontSize: '16px', color: '#666' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
          <h2 style={{ textAlign: 'center', fontSize: '30px', color: '#fff', marginBottom: '20px' }}>
            Ready to get started?
          </h2>
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
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
