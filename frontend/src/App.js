import React from "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/home";
import Error from "./components/error";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Usage_steps from "./components/usage_steps";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div>

      <Router>
      <Switch>
      <Route exact path="/"  component={() => < Home />} />
      <Route exact path="/usage_steps"  component={() => < Usage_steps />} />
      <Route exact path="/login" component={Login} />
       <Route exact path="/signup" component={Signup} />
      <Route component={() => <Error  />} />
      </Switch>
      </Router>
  </div>
  );
}

export default App;
