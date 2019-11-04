import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import NavigationBar from "./components/NavigationBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Printers from "./components/Printers/Printers";
import Requests from "./components/Requests/Requests";
import Dashboard from "./components/Dashboard/Dashboard";
import io from "socket.io-client";

class App extends Component {
  componentDidMount() {
    const socket = io.connect("http://localhost:5001", { 'forceNew': true });
    socket.on("news", function(data) {
      console.log(data);
    });    
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <NavigationBar />
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/printers" component={Printers} />
            <Route exact path="/requests" component={Requests} />
            <Route exact path="/payment_approved" component={Requests} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
