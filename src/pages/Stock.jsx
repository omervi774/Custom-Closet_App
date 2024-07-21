import React from 'react'
import useData from '../useData'
import useEditData from '../useEditData'
import { serverRoute } from '../components/consts/consts'


const TitleStyle = {
  textAlign: 'center',
};

const TableStyle = {
  width: '80%',
  margin: '0 auto',
  borderCollapse: 'collapse',
  marginTop: '20px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
};

const ThTdStyle = {
  padding: '12px 15px',
  textAlign: 'center',
  borderBottom: '1px solid #e0e0e0',
};

const ThStyle = {
  ...ThTdStyle,
  backgroundColor: '#f8f9fa',
  fontWeight: 'bold',
  color: '#495057',
};

const TdStyle = ThTdStyle;

const ButtonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const ButtonStyle = {
  backgroundColor: '#007bff',
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '5px',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

const ButtonHoverStyle = {
  backgroundColor: '#0056b3',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const StockManagementPage = () => {
  const [stockData, setStockData] = useData(`${serverRoute}/stocks`);
  const [jsx, handleOpen] = useEditData(`${serverRoute}/stocks`, setStockData, stockData);

  return (
    <div className="stock-management-container">
      <h1 style={TitleStyle}>ניהול מלאי</h1>
      <div className="table-container">
        <table style={TableStyle}>
          <thead>
            <tr>
              <th style={ThStyle}>פעולה</th>
              <th style={ThStyle}>מחיר</th>
              <th style={ThStyle}>כמות</th>
              <th style={ThStyle}>שם</th>
            </tr>
          </thead>
          <tbody>
            {stockData &&
              stockData.map((item, index) => (
                <tr key={index}>
                  <td style={TdStyle}>
                    <div style={ButtonContainerStyle}>
                      <button
                        style={ButtonStyle}
                        onMouseEnter={e => Object.assign(e.target.style, ButtonHoverStyle)}
                        onMouseLeave={e => Object.assign(e.target.style, ButtonStyle)}
                        onClick={() => handleOpen(item.id, 'quantity')}
                      >
                        ערוך כמות
                      </button>
                      <button
                        style={ButtonStyle}
                        onMouseEnter={e => Object.assign(e.target.style, ButtonHoverStyle)}
                        onMouseLeave={e => Object.assign(e.target.style, ButtonStyle)}
                        onClick={() => handleOpen(item.id, 'price')}
                      >
                        ערוך מחיר
                      </button>
                    </div>
                  </td>
                  <td style={TdStyle}>{item.price}</td>
                  <td style={TdStyle}>{item.quantity}</td>
                  <td style={TdStyle}>{item.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {jsx()}
    </div>
  );
};

export default StockManagementPage;