import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Message,Header } from "semantic-ui-react";
import logo from "../../images/logo.jpg"
import axios from "axios";
import "./auth.css"

class Signup extends Component {
constructor(props) {
    super(props);
this.state = { username:'', password: '', email: '', confirm: '', errormessage:''};
  
  }
    
  handleChange = (e, { name, value }) => {
  this.setState({ [name]: value });
  this.setState({errormessage: ''});
  }

  handleSubmit = (e) => {
    
      const payload = {
      	username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        status: "logging in",
      };
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(this.state.password!==this.state.confirm)
      {
      	this.setState({errormessage: "Check confirm"});
      }
      else if(!pattern.test(this.state.email))
      {
      	this.setState({errormessage:"Invalid"});
      }
      else
      {
      axios
        .post("http://localhost:8080/registerUser", payload)
        .then((response) => {
          if (response.status === 201) {
            this.setState({errormessage : "Success",})
            console.log(response.data);
      		setTimeout(function(){window.location.assign("http://localhost:3000/");},3000);
 
          } 
          else
          {
          	this.setState({errormessage: "Error"});
          }
        })
        .catch((error) =>{
          if(error.response.status===400)
          {
           this.setState({errormessage: "Wrong email"});
           }
           else
          {
          	this.setState({errormessage: "Error"});
          }
        });
        }
  }



    render() {
    return (
 <div className="auth-main">
        <div class="auth-content">
          <div className="auth-card">
            <img src={logo} alt="Logo" className="auth-logo" />
            <Header as="h2" color="black" textAlign="center">
              Sign Up
            </Header>
           
         <Form.Group size="large" className="auth-form" autocomplete="off">    
          <Form.Input
          fluid
          icon="user"
          name='username'
          iconPosition="left"
          placeholder="Full name"
          className="auth-input-field"
          onChange={this.handleChange}
        /> <Form.Input
          fluid
          icon="envelope"
          name='email'
          iconPosition="left"
          placeholder="E-mail address"
          className="auth-input-field"
          onChange={this.handleChange}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          name='password'
          placeholder="Password"
          type="password"
          className="auth-input-field"
          onChange={this.handleChange}
        />
        <Form.Input
          fluid
          icon="lock"
          name='confirm'
          iconPosition="left"
          placeholder="Confirm Password"
          type="password"
          className="auth-input-field"
          onChange={this.handleChange}
        />

        
          <Button color="teal" fluid size="huge" onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password || !this.state.username || !this.state.confirm}>
            Sign up
          </Button>
     
        <Link to="/">
          <Button color="red" fluid size="huge">
            Cancel
          </Button>
        </Link>

        <Message size="big">
          <Link to="/login">Already Registered? Log in</Link>
        </Message>
       
        {this.state.errormessage==="Success"?
        <Message success>
        	Signed up successfully. You can log in now
        </Message>
        :
        null}
        {this.state.errormessage==="Check confirm"?
        <Message error>
        	Password and confirm password are different
        </Message>
        :
        null}
        {this.state.errormessage==="Wrong email"?
        <Message error>
        	Email already exits. Log in or check your email.
        </Message>
        :
        null}
        {this.state.errormessage==="Invalid"?
        <Message error>
        	Please enter valid email format.
        </Message>
        :
        null}
        {this.state.errormessage==="Error"?
        <Message error>
        	Error occured. Try again.
        </Message>
        :
        null}
</Form.Group>
      </div>
        </div>
      </div>
    );
  }
}
export default Signup
