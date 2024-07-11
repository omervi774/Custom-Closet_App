import React from 'react'
import useData from '../useData'
import useEditData from '../useEditData'
import { serverRoute } from '../components/consts/consts'

const TitleStyle = {
  textAlign: 'center',
}

const TableStyle = {
  width: '80%',
  margin: '0 auto',
  borderCollapse: 'collapse',
  marginTop: '20px',
}

const ThTdStyle = {
  border: '1px solid black',
  padding: '8px',
  textAlign: 'center',
}

const ButtonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const ButtonStyle = {
  margin: '4px 0',
}

const StockManagementPage = () => {
  const [stockData, setStockData] = useData(`${serverRoute}/stocks`)
  const [jsx, handleOpen] = useEditData(`${serverRoute}/stocks`, setStockData, stockData)

  return (
    <div className="stock-management-container">
      <h1 style={TitleStyle}>ניהול מלאי</h1>
      {/* <button onClick={handleAddItem} className="add-button">
        Add Item
      </button> */}

      <table style={TableStyle}>
        <thead>
          <tr>
            <th style={ThTdStyle}>פעולה</th>
            <th style={ThTdStyle}>מחיר</th>
            <th style={ThTdStyle}>כמות</th>
            <th style={ThTdStyle}>שם</th>
          </tr>
        </thead>
        <tbody>
          {stockData &&
            stockData.map((item, index) => (
              <tr key={index}>
                <td style={ThTdStyle}>
                  <div style={ButtonContainerStyle}>
                    <button style={ButtonStyle} onClick={() => handleOpen(item.id, 'quantity')}>ערוך כמות</button>
                    <button style={ButtonStyle} onClick={() => handleOpen(item.id, 'price')}>ערוך מחיר</button>
                  </div>
                </td>
                <td style={ThTdStyle}>{item.price}</td>
                <td style={ThTdStyle}>{item.quantity}</td>
                <td style={ThTdStyle}>{item.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {jsx()}
    </div>
  )
}

export default StockManagementPage
