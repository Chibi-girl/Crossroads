import { Component } from "react";

class Auth extends Component {
  state = {
    authenticated: true,
    username: "",
  }
  constructor(props) {
    super(props);
    const username = localStorage.getItem("username");

    this.state.username = username;
    if (username === null) {

      this.state.authenticated = false;
    }

  }




  isAuthenticated() {
    return this.state.authenticated;
  }
  user() {
    return this.state.username;
  }

}

export default new Auth();
