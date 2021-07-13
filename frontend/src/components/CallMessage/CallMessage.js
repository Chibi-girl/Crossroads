import React from "react";
import "./CallMessage.css";

/**
 * Props:
 * - header: string
 * - detail: string
 * - isError: boolean
 */
export default function CallMessage(props) {
  //displays message in centre of screen in case of error or if only one participant is present
  return (
    <div className={"call-message" + (props.isError ? " error" : "")}>
      <p className="call-message-header">{props.header}</p>
      <p>{props.detail}</p>
    </div>
  );
}
