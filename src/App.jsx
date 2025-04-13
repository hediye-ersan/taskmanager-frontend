import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import './output.css'


const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            {/* Diğer route'ları buraya ekle */}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App
