// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./style.css";
// import TradingChart from "./TradingChart";

// ReactDOM.createRoot(document.getElementById("app")!).render(
//   <React.StrictMode>
//     <TradingChart />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TradingChart from "./TradingChart";
import FormPage from "./routes/form/Form";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TradingChart />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
