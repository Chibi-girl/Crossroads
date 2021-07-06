import { withRouter, Link } from "react-router-dom";
import React, {useState } from 'react';
import axios from "axios";
import {Button,Container,Menu,Modal, Input} from 'semantic-ui-react'
import Auth from "./auth/authenticate";
function Navigation(props) {
       const [url, setUrl] = useState("");
         const [open, setOpen] =useState(false);
  const handleChange = (e,{value}) => {
    setUrl( value);
  };
  	const handleSubmit = (e) => {
    
      const payload = {
        email: localStorage.getItem("email"),
        status: "logging out",
      };
      
      axios
        .post("http://localhost:8080/loggingUser", payload)
        .then((response) => {
          if (response.status === 201) {
            console.log(response.data);
      		localStorage.removeItem("username");
      		localStorage.removeItem("email");
      		localStorage.setItem("visit","notfirst");
      		window.location.reload();
 
          } else {
            console.log("Some error ocurred");
          }
        })
        .catch((error) =>{
        console.log(error);
        });
  }
  
 if(Auth.isAuthenticated()){
  return(
  <Container>
                <Menu.Item as={Link} to="/" name='Home' active={props.active==="home"} >
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/usage_steps" name='usage_steps' active={props.active==="usage"}>How it works</Menu.Item>
                <Menu.Item position='right'>
                 
                  <Modal size='tiny' dimmer='blurring' style={{ marginLeft: '35.5em', marginTop:'7em', height:'15em'}}
						  onClose={() => setOpen(false)}
						  onOpen={() => setOpen(true)}
						  open={open}
						  trigger={<Button basic color='teal' style={{ marginLeft: '0.5em' }}>Join Room</Button>}>
						  <Modal.Header>Enter room link</Modal.Header>
						   <Input fluid placeholder='room url..' onChange={handleChange}/>
						  <Modal.Actions>
							<Button color='red' onClick={() => setOpen(false)}>
							  Cancel
							</Button>
							<Button
							  content="Join"
							  labelPosition='right'
							  icon='checkmark'
							  onClick={()=>{props.parentCallback2(url);}}
							  positive
							/>
						  </Modal.Actions>
						</Modal>
     
        <Button color='blue' style={{ marginLeft: '0.5em' }}
          onClick={() => {props.parentCallback("start");}}>
           Start a new call
    </Button>
<Button basic color='teal' style={{ marginLeft: '0.5em' }} as={Link} to="/"  onClick={handleSubmit} >
                    Log out
                  </Button>
                  
                </Menu.Item>
              </Container>
  );}
  else 
  return (
                <Container>
                <Menu.Item as={Link} to="/" name='Home' active={props.active==="home"} >
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/usage_steps" name='usage_steps' active={props.active==="usage"}>How it works</Menu.Item>
                <Menu.Item position='right'>
                  <Button color='blue' as={Link} to="/login" >
                    Log in
                  </Button>
                  <Button basic color='teal' as={Link} to="/signup" style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Container>
              
  );
}

export default withRouter(Navigation);
