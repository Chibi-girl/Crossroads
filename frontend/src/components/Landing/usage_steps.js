import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Segment,
  Card,
} from "semantic-ui-react";
import CommonPage from "./commonpage";

function Home() {
  // component to be rendered when user is on usage_steps page
  const usage_steps = (
    <div>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text style={{ textAlign: "center" }}>
          <Header as="h3" style={{ fontSize: "2em" }}>
            It's as easy as dialing a number, no kidding.
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Just register using some simple credentials and log in with the
            same. There you go, ready to get a call started.
          </p>
        </Container>
      </Segment>

      <Container text style={{ textAlign: "center", margin: "2em" }}>
        <Header as="h2" style={{ fontSize: "2em", color: "purple" }}>
          Getting Access
        </Header>
      </Container>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Container text style={{ textAlign: "center", padding: "1em" }}>
              <Header as="h3" style={{ fontSize: "1.3em" }}>
                FROM YOUR PC, OR LAPTOP
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                You can join or start a call from both your PC or laptop, for
                free of cost, using any modern web browser . There is no need to
                install any other software to get this running.
              </p>
            </Container>
          </Grid.Column>

          <Grid.Column>
            <Container text style={{ textAlign: "center", padding: "1em" }}>
              <Header as="h3" style={{ fontSize: "1.3em" }}>
                FROM YOUR MOBILE PHONE, TABLET
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                Work under progress. But when it's done it'll be as easy as just
                downloading the app from playstore, registering and getting
                started right away, like you did with your pc/laptop.
              </p>
            </Container>
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text style={{ textAlign: "center", margin: "2em" }}>
          <Header as="h2" style={{ fontSize: "2em", color: "purple" }}>
            Basics of using the website
          </Header>
        </Container>
        <Card.Group itemsPerRow={3} style={{ margin: "3em" }}>
          <Card raised>
            <Image src="images/start.png" centered />
            <Card.Content>
              <Card.Header>Start a Call</Card.Header>
              <Card.Description>
                Just move to the start a new call button once you've logged in.
                And ta-da! You can then share the link of the newly created room
                for others to join in
              </Card.Description>
            </Card.Content>
          </Card>

          <Card raised style={{ margin: "10px" }}>
            <Image src="images/login.png" size="medium" centered />
            <Card.Content>
              <Card.Header>Logging in</Card.Header>
              <Card.Description>
                Providing the credentials you provided during signing up should
                be enough.
              </Card.Description>
            </Card.Content>
          </Card>

          <Card raised>
            <Image src="images/join.png" centered />
            <Card.Content>
              <Card.Header>Joining a call</Card.Header>
              <Card.Meta>Co-Worker</Card.Meta>
              <Card.Description>
                Hit the join call button once you've logged in and enter the
                link of the room shared with you. Click Join.
              </Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
      </Segment>

      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: "2em" }}>
            Meet your friends and loved ones. Ace that meeting.
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Invite your clan to this platform. Present your documents, or send
            that secret message. Our rooms are big enough to accomodate 500
            folks at a go, so get that party, (or presentation =3 ) started.
          </p>
          <Button as="a" size="large">
            Read More
          </Button>

          <Divider
            as="h4"
            className="header"
            horizontal
            style={{ margin: "3em 0em", textTransform: "uppercase" }}
          >
            <a href="#">Move to top</a>
          </Divider>

          <Header as="h3" style={{ fontSize: "2em" }}>
            Quality Assured. And peace of mind.
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Now you don't have to get all jittery about a fluctuating network;
            CrossRoads adapts itself according to the quality of your net
            connection. It holds on till the very end, making sure you can have
            as seamless an experience as possible .
          </p>
          <Button as="a" size="large">
            Might need this in the future
          </Button>
        </Container>
      </Segment>
    </div>
  );
  return <CommonPage curr={usage_steps} active="usage_steps" />;
}

export default withRouter(Home);
