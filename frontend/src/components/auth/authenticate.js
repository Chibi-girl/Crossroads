import { Component } from "react";

class Auth extends Component {
  state = {
    authenticated: true,
    username: "",
  };
  constructor(props) {
    super(props);
    const username = localStorage.getItem("username"); //checking if local-storage key has been set from a previous login

    this.state.username = username;
    if (username === null) {
      //setting authenticated to false if user's local-storage key is not set
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
