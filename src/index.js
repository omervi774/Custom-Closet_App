import React from "react";
import ReactDOM from "react-dom/client";
import theme from "./Theme";
import App from "./App";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import Ai from "./pages/Ai";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneLogIn from "./pages/PhoneLogIn";

// import WorkOut from "./pages/Workout/WorkOut";
// import About from "./pages/About/About";
// import Home from "./pages/Home/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="ai" element={<Ai />} />
            <Route path="orders" element={<Orders />} />
            <Route path="phoneLogIn" element={<PhoneLogIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
