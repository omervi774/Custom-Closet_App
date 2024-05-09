import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './Theme'
import App from './App'
import Orders from './pages/Orders'
import Home from './pages/Home'
import Ai from './pages/Ai'
import Stock from './pages/Stock'
import Landing from './pages/Landing'
import { ThemeProvider } from '@emotion/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PhoneLogIn from './pages/PhoneLogIn'

const root = ReactDOM.createRoot(document.getElementById('root'))
// this is all our routes and navigation in the app
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="ai" element={<Ai />} />
            <Route path="stock" element={<Stock />} />
            <Route path="orders" element={<Orders />} />
            <Route path="landing" element={<Landing />} />
            <Route path="phoneLogIn" element={<PhoneLogIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
