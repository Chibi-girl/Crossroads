import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Message,Header } from "semantic-ui-react";
import logo from "../../images/logo.jpg"
import axios from "axios";
import "./auth.css"
class Login extends Component {

  constructor(props) {
    super(props);
this.state = { password: '', email: '',  errormessage:'', emailerror:false};
  
  }
    
  handleChange = (e, { name, value }) => 
  {
  this.setState({ [name]: value });
  this.setState({errormessage: ''});
  }

  handleSubmit = (e) => {
    
      const payload = {
        email: this.state.email,
        password: this.state.password,
        status: "logging in",
      };
      
      axios
        .post("http://localhost:8080/loggingUser", payload)
        .then((response) => {
          if (response.status === 200) {
            this.setState({errormessage : "success",})
            console.log(response.data);
            localStorage.setItem("username", response.data.user_name);
            localStorage.setItem("email",response.data.email);
            localStorage.setItem("visit",response.data.visit);
      		setTimeout(function(){window.location.assign("http://localhost:3000/");},3000);
 
          } else {
            console.log("Some error ocurred");
    		this.setState({errormessage: "Error"});
          }
        })
        .catch((error) =>{
        if(error.response.status===403)
        {
           this.setState({errormessage: "Wrong password"});
          }
          else if(error.response.status===401)
        {
           this.setState({errormessage: "Not registered"});
          }
          else
          {
          	this.setState({errormessage: "Error"});
          }
        });
  }
  
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
          name='email'
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
          name='password'
          placeholder="Password"
          type="password"
          className="auth-input-field"
          onChange={this.handleChange}
        />

       
          <Button color="teal" fluid size="huge" onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password}>
            Login
          </Button>
        
         <Link to="/">
          <Button color="red" fluid size="huge">
            Cancel
          </Button>
        </Link>

        <Message size="big">
          <Link to="/signup">Not Registered?</Link>
        </Message>
        {this.state.errormessage==="success"?
        <Message success>
        	Logged in successfully. Redirecting...
        </Message>
        :
        null}
  
        {this.state.errormessage==="Wrong password"?
        <Message error>
        	Wrong password
        </Message>
        :
        null}
        {this.state.errormessage==="Not registered"?
        <Message error>
        	You haven't registered. Sign up first
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
export default Login;
