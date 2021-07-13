import React from "react";
import "./error.css";

function Error(props) {
  //error page displayed when room url is invalid or unavailable path is entered in address bar
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>Oops!</h1>
        </div>
        <h2>404 - Page not found</h2>
        {props.error !== "true" ? ( //message for invalid path
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>
        ) : (
          // message for invalid room joining url
          <p>
            The room you're trying to visit has probably expired. Try starting a
            new call or enter a valid room link.
          </p>
        )}
        <a href="/">Go To Homepage</a>
      </div>
    </div>
  );
}

export default Error;
