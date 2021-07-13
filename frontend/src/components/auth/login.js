import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Form, Message, Header } from "semantic-ui-react";

import logo from "../../images/logo.jpg";
import userContext from "../../GlobalContext/userContext";
import "./auth.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      errormessage: "",
      username: "",
      emailerror: false,
      loading: false,
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
    this.setState({ errormessage: "" });
  };

  handleSubmit = (e) => {
    //function fired when log in button is clicked
    this.setState({ loading: true });
    const payload = {
      email: this.state.email,
      password: this.state.password,
      status: "logging in",
    };

    axios //api call to backend to log in user with his credentials
      .post("https://cross-roads.herokuapp.com/loggingUser", payload)
      .then((response) => {
        if (response.status === 200) {
          //successfully logged in
          this.setState({ errormessage: "success" });
          userContext.setData(response.data);
          localStorage.setItem("username", response.data.user_name);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("visit", response.data.visit);
          axios //another api call to backend to gather chat list of user after logging in
            .get("https://cross-roads.herokuapp.com/chats/" + this.state.email)
            .then((res) => {
              if (res.status === 200) {
                userContext.setChat(res.data.chatlist);
                setTimeout(function () {
                  window.location.href = "/";
                }, 2000);
              }
            })
            .catch((error) => {
              console.log("Error getting chatlist");
              this.setState({ errormessage: "Chatlist" });
              this.setState({ loading: false });
            });
        } else {
          console.log("Some error ocurred");
          this.setState({ errormessage: "Error" });
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // backend sends error due to wrong password
        if (error.response.status === 403) {
          this.setState({ errormessage: "Wrong password" });
          this.setState({ loading: false });
        }
        //backend sends error due to unregistered email
        else if (error.response.status === 401) {
          this.setState({ errormessage: "Not registered" });
          this.setState({ loading: false });
        } else {
          this.setState({ errormessage: "Error" });
          this.setState({ loading: false });
        }
      });
  };

  render() {
    return (
      <div className="auth-main">
        <div class="auth-content">
          <div className="auth-card">
            <img src={logo} alt="Logo" className="auth-logo" />
            <Header as="h2" color="black" textAlign="center">
              Login
            </Header>

            <Form.Group size="large" className="auth-form" autocomplete="off">
              <Form.Input
                fluid
                icon="user"
                name="email"
                iconPosition="left"
                placeholder="E-mail address"
                className="auth-input-field"
                onChange={this.handleChange}
                error={this.state.emailerror}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                className="auth-input-field"
                onChange={this.handleChange}
              />
              {/* Submit form info for logging in*/}
              <Button
                color="teal"
                style={{ margin: "1em" }}
                attached="top"
                loading={this.state.loading}
                size="huge"
                onClick={this.handleSubmit}
                disabled={!this.state.email || !this.state.password}
              >
                Login
              </Button>

              <Link to="/">
                {" "}
                {/* Return to home page */}
                <Button
                  color="red"
                  style={{ margin: "1em" }}
                  attached="bottom"
                  size="huge"
                >
                  Cancel
                </Button>
              </Link>

              <Message size="big">
                {" "}
                {/* Redirect to sign up page */}
                <Link to="/signup">Not Registered?</Link>
              </Message>
              {this.state.errormessage === "success" ? (
                <Message success>
                  Logged in successfully. Redirecting...
                </Message>
              ) : null}

              {this.state.errormessage === "Wrong password" ? (
                <Message error>Wrong password</Message>
              ) : null}
              {this.state.errormessage === "Not registered" ? (
                <Message error>You haven't registered. Sign up first</Message>
              ) : null}
              {this.state.errormessage === "Error" ? (
                <Message error>Error occured. Try again.</Message>
              ) : null}
              {this.state.errormessage === "Chatlist" ? (
                <Message error>
                  Error occured in retriving chatlist. Try again.
                </Message>
              ) : null}
            </Form.Group>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
