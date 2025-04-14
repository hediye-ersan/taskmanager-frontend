import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Token kontrolü

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route
          path="/dashboard"
          render={() =>
            isAuthenticated ? <Dashboard /> : <Redirect to="/login" />
          }
        />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
