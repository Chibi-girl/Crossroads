import React,{useState} from 'react';
import {withRouter} from "react-router-dom";
import {Button,Container,Divider,Grid,Header,Image,Segment,} from 'semantic-ui-react'
import CommonPage from "./commonpage";

function Home() {
      
    // component to be rendered when user is in home page
    const home= ( 
    <div>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
       <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
              We value your privacy
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            Crossroads uses stringent security measures to protect your information and privacy. Video conferences on CrossRoads are encrypted during transit. 
            Our security measures are constantly updated to give you better protection.
            </p>
            <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
			 One stop solution for all : businesses and individual alike.  
            </Header>
            <p style={{ fontSize: '1.33em' }}>
			The website has been structured so that it strikes a balance between a homely environment and corporate feel. 
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src='/images/logo.jpg' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em', fontStyle: 'italic' }}>
              "Fluid interface. Seamless connectivity"
            </Header>
            <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em', fontStyle: 'italic' }}>
              "It's a great enough website to make me want to use it as my goto platform for video and audio online calls"
            </Header>
            <p style={{ fontSize: '1.33em' }}>
             Not-so Anonymous User
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
          Meet your friends and loved ones. Ace that meeting.
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Invite your clan to this platform. Present your documents, or send that secret message. Our rooms are big enough to accomodate 500 folks at a go, so get that party, (or presentation =3 ) started.
        </p>
        <Button as='a' size='large'>
          Read More
        </Button>

        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>Move to top</a>
        </Divider>

        <Header as='h3' style={{ fontSize: '2em',color:'purple' }}>
          Quality Assured. And peace of mind.
        </Header>
        <p style={{ fontSize: '1.33em' }}>
     			Now you don't have to get all jittery about a fluctuating network; CrossRoads adapts itself according to the quality of your net connection. It holds on till the very end, making sure you can have as seamless an experience as possible .
        </p>
        <Button as='a' size='large'>
			Might need this in the future
        </Button>
      </Container>
    </Segment>
    </div>
    );
     
    return (
    <CommonPage curr={home} active="home"/>
     );
}





export default withRouter(Home);
