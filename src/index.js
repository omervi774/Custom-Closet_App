import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './Theme'
import App from './App'
import Orders from './pages/Orders'
import ClosetDesign from './pages/ClosetDesign'
import Ai from './pages/Ai'
import Stock from './pages/Stock'
import Home from './pages/Home'
import { ThemeProvider } from '@emotion/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PhoneLogIn from './pages/PhoneLogIn'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'

const root = ReactDOM.createRoot(document.getElementById('root'))
// this is all our routes and navigation in the app
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="closetDesign" element={<ClosetDesign />} />
          <Route path="ai" element={<Ai />} />
          <Route path="stock" element={<Stock />} />
          <Route path="orders" element={<Orders />} />
          <Route path="phoneLogIn" element={<PhoneLogIn />} />
          <Route path="paymentSuccess" element={<PaymentSuccess />} />
          <Route path="paymentFailure" element={<PaymentFailure />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  // </React.StrictMode>
)
