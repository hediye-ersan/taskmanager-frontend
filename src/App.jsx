import React from "react";
import { BrowserRouter as Router} from "react-router-dom";
import "./output.css"; // Tailwind CSS dosyası
import BoardPage from "./pages/BoardPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  return (
    
      <Router>
        <div className="flex">
          <Sidebar />
          <div>
          <Header />
          <BoardPage />
          </div>
          
          

        </div>
      </Router>
    
  );
}

export default App;
