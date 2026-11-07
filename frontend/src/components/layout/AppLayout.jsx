import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
