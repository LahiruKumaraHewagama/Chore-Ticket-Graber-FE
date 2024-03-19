import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as authConfig from "./authconfig.json";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <AuthProvider config={{authConfig}}>
  <React.StrictMode>
    <div
      style={{
        backgroundImage: `url(${require("./resources/hotel-room.png")}`,
        minHeight: "100vh",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
  // </AuthProvider>
);
