import React from "react";
import {Link} from "react-router-dom";
import { Button } from "semantic-ui-react";

function Error(props) {
  return (
    <div className="404">
      <div className="error-div">
      <h1>Uh Oh!! 404</h1>
      <h1>Page not found</h1>
      <Button primary as={Link} to="/">
        Go to home page
      </Button>

      </div>
     
    </div>
  );
}

export default Error;
