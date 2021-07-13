import { withRouter, Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { Button, Container, Menu, Modal, Input } from "semantic-ui-react";

import Auth from "../auth/authenticate";
import userContext from "../../GlobalContext/userContext";
import ChatBoard from "../PostMeetChat/chatboard";

function Navigation(props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e, { value }) => {
    //setting url of room to be joined from within join room modal
    setError(false);
    setUrl(value);
  };

  const handleSubmit = (e) => {
    // function for logging out user fired when Log Out button is clicked
    setLoading(true);
    const payload = {
      email: userContext.getEmail(),
      status: "logging out",
    };

    axios //call to backend to log out user with specified email
      .post("https://cross-roads.herokuapp.com/loggingUser", payload)
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data);
          localStorage.removeItem("username");
          localStorage.setItem("visit", "notfirst");
          window.location.reload();
          console.log(userContext.getData());
        } else {
          console.log("Some error ocurred");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (Auth.isAuthenticated()) {
    // if user has logged in previously allow him to start/join calls
    return (
      <Container>
        <Menu.Item
          as={Link}
          to="/"
          name="Home"
          active={props.active === "home"}
        >
          Home
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/usage_steps"
          name="usage_steps"
          active={props.active === "usage_steps"}
        >
          How it works
        </Menu.Item>
        <Menu.Item position="right">
          {" "}
          {/* Modal that opens up when Join Room is clicked*/}
          <Modal
            size="tiny"
            dimmer="blurring"
            style={{ marginLeft: "35.5em", marginTop: "7em", height: "15em" }}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
              <Button basic color="teal" style={{ marginLeft: "0.5em" }}>
                Join Room
              </Button>
            }
          >
            <Modal.Header>Enter room code to join</Modal.Header>
            <Input
              fluid
              error={error}
              placeholder="room url.."
              onChange={handleChange}
            />
            <Modal.Actions>
              <Button color="red" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                content="Join"
                labelPosition="right"
                icon="checkmark"
                onClick={() => {
                  props.parentCallback2("https://crossroads.daily.co/" + url);
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
          <ChatBoard /> {/* Call to dropdown component for chat lists */}
          {/* starting a new call */}
          <Button
            color="blue"
            style={{ marginLeft: "0.5em" }}
            onClick={() => {
              props.parentCallback();
            }}
          >
            Start a new call
          </Button>
          {/* Logging out */}
          <Button
            basic
            loading={loading}
            color="teal"
            style={{ marginLeft: "0.5em" }}
            as={Link}
            to="/"
            onClick={handleSubmit}
          >
            Log out
          </Button>
        </Menu.Item>
      </Container>
    );
  } //if user has logged out or it's his first visit, prompt him to sign in/log in
  else
    return (
      <Container>
        <Menu.Item
          as={Link}
          to="/"
          name="Home"
          active={props.active === "home"}
        >
          Home
        </Menu.Item>
        {/*redirecting to usage steps page*/}
        <Menu.Item
          as={Link}
          to="/usage_steps"
          name="usage_steps"
          active={props.active === "usage_steps"}
        >
          How it works
        </Menu.Item>
        <Menu.Item position="right">
          <Button color="blue" as={Link} to="/login">
            {" "}
            {/*redirecting to login page */}
            Log in
          </Button>
          {/* Redirecting to sign up page */}
          <Button
            basic
            color="teal"
            as={Link}
            to="/signup"
            style={{ marginLeft: "0.5em" }}
          >
            Sign Up
          </Button>
        </Menu.Item>
      </Container>
    );
}

export default withRouter(Navigation);
