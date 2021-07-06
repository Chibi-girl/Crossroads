import React from "react";
import "./error.css"
import {Link} from "react-router-dom";
import { Button } from "semantic-ui-react";

function Error(props) {
  return (
<div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>Oops!</h1>
			</div>
			<h2>404 - Page not found</h2>
			{
			(props.error!=="true")?
			(<p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>):
			(<p>The room you're trying to visit has probably expired. Try starting a new call or enter a valid room link.</p>)
			}
			<a href="http://localhost:3000/">Go To Homepage</a>
		</div>
	</div>
  );
}

export default Error;
