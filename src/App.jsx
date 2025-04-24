import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./output.css"; // Tailwind CSS dosyası
import BoardPage from "./pages/BoardPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [activePage, setActivePage] = useState("Board"); // Aktif sayfa durumu
  const [searchQuery, setSearchQuery] = useState(""); // Arama kelimesi

  // Uygulama yüklendiğinde token kontrolü
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsAuthChecked(true); // Kontrol tamamlandı
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    setIsAuthenticated(false); // Kullanıcıyı çıkış yapmış olarak işaretle
  };

  return (
    <Router>
      {!isAuthChecked ? (
        <div className="flex justify-center items-center h-screen text-xl">Yükleniyor...</div>
      ) : (
        <Switch>
          {/* Login/Register Sayfası */}
          <Route path="/auth">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <AuthPage onLogin={() => setIsAuthenticated(true)} />}
          </Route>

          {/* Ana Sayfa */}
          <Route path="/dashboard">
            {isAuthenticated ? (
              <div className="flex">
                <Sidebar onLogout={handleLogout} onNavigate={setActivePage} />
                <div className="flex-1">
                  <Header onSearch={setSearchQuery} /> {/* Arama kelimesini al */}
                  {activePage === "Dashboard" ? (
                    <DashboardPage />
                  ) : (
                    <BoardPage searchQuery={searchQuery} /> 
                  )}
                </div>
              </div>
            ) : (
              <Redirect to="/auth" />
            )}
          </Route>

          {/* Varsayılan Yönlendirme */}
          <Redirect to={isAuthenticated ? "/dashboard" : "/auth"} />
        </Switch>
      )}
    </Router>
  );
}

export default App;
