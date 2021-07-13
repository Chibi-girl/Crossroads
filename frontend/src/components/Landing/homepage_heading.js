import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Icon,Image } from "semantic-ui-react";

const HomepageHeading = () => (
  <Container text>
    <Header
      as="h1"
      content="Crossroads"
      style={{
        fontSize: "4em",
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: "1.8em",
      }}
    />
    <Header
      as="h2"
      content="Making every connection matter"
      style={{
        fontSize: "1.7em",
        fontWeight: "normal",
        marginTop: "1.5em",
      }}
    />
    <Button primary size="huge" as={Link} to="/signup">
      Get Started
      <Icon name="right arrow" />
    </Button>
  </Container>
);


export default HomepageHeading;
