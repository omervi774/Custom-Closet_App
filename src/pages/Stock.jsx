import React from 'react'
import useData from '../useData'

import StockCard from '../components/StockCard/StockCard'
import useEditData from '../useEditData'

const TitleStyle = {
  textAlign: 'center',
}

const ConstiarCardStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  paddingTop: '5%',
}

const StockManagementPage = () => {
  const [stockData, setStockData] = useData('http://localhost:5000/stocks')
  const [jsx, handleOpen] = useEditData('http://localhost:5000/stocks', setStockData, stockData)

  return (
    <div className="stock-management-container">
      <h1 style={TitleStyle}>ניהול מלאי</h1>
      {/* <button onClick={handleAddItem} className="add-button">
        Add Item
      </button> */}

      <div style={ConstiarCardStyle}>
        {stockData &&
          stockData.map((item, index) => (
            <StockCard key={index} name={item.name} quantity={item.quantity} price={item.price} id={item.id} handleOpen={handleOpen} />
          ))}
      </div>
      {jsx()}
    </div>
  )
}

export default StockManagementPage
