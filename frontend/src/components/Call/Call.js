import React, {
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useState,
} from "react";

import "./Call.css";
import Tile from "../Tile/Tile";
import CallObjectContext from "../../GlobalContext/CallObjectContext";
import CallMessage from "../CallMessage/CallMessage";
import {
  initialCallState,
  CLICK_ALLOW_TIMEOUT,
  PARTICIPANTS_CHANGE,
  CAM_OR_MIC_ERROR,
  NETWORK_CHANGE,
  FATAL_ERROR,
  callReducer,
  isLocal,
  isScreenShare,
  containsScreenShare,
  getMessage,
} from "./callState";
import { logDailyEvent } from "../../Utils/logUtils";

export default function Call(props) {
  const callObject = useContext(CallObjectContext);
  const [callState, dispatch] = useReducer(callReducer, initialCallState);
  /**
   * Start listening for participant changes, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = [
      "participant-joined",
      "participant-updated",
      "participant-left",
    ];

    function handleNewParticipantsState(event) {
      event && logDailyEvent(event);
      dispatch({
        type: PARTICIPANTS_CHANGE,
        participants: callObject.participants(),
      });
    }

    // Use initial state
    handleNewParticipantsState();

    // Listen for changes in state
    for (const event of events) {
      callObject.on(event, handleNewParticipantsState);
    }

    // Stop listening for changes in state
    return function cleanup() {
      for (const event of events) {
        callObject.off(event, handleNewParticipantsState);
      }
    };
  }, [callObject]);

  /**
   * Start listening for call errors, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleCameraErrorEvent(event) {
      logDailyEvent(event);
      dispatch({
        type: CAM_OR_MIC_ERROR,
        message:
          (event && event.errorMsg && event.errorMsg.errorMsg) || "Unknown",
      });
    }

    // We're making an assumption here: there is no camera error when callObject
    // is first assigned.

    callObject.on("camera-error", handleCameraErrorEvent);

    return function cleanup() {
      callObject.off("camera-error", handleCameraErrorEvent);
    };
  }, [callObject]);

  useEffect(() => {
    if (!callObject) return;
    function handleNetworkEvent(event) {
      console.log("here");
      logDailyEvent(event);
      dispatch({
        type: NETWORK_CHANGE,
        message: event.threshold,
        participants: callObject.participants(),
        id: callObject.participants().local.user_id,
      });
    }
    callObject.on("network-quality-change", handleNetworkEvent);

    return function cleanup() {
      callObject.off("network-quality-change", handleNetworkEvent);
    };
  }, [callObject]);
  /**
   * Start listening for fatal errors, when the callObject is set.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleErrorEvent(e) {
      logDailyEvent(e);
      dispatch({
        type: FATAL_ERROR,
        message: (e && e.errorMsg) || "Unknown",
      });
    }

    // We're making an assumption here: there is no error when callObject is
    // first assigned.

    callObject.on("error", handleErrorEvent);

    return function cleanup() {
      callObject.off("error", handleErrorEvent);
    };
  }, [callObject]);

  /**
   * Start a timer to show the "click allow" message, when the component mounts.
   */
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: CLICK_ALLOW_TIMEOUT });
    }, 2500);

    return function cleanup() {
      clearTimeout(t);
    };
  }, []);

  /**
   * Send an app message to the remote participant whose tile was clicked on.
   */

  function getTiles() {
    let largeTiles = [];
    let smallTiles = [];
    Object.entries(callState.callItems).forEach(([id, callItem]) => {
      // creating a small time for local participant, large tiles for all other cases
      const isLarge =
        isScreenShare(id) ||
        (!isLocal(id) && !containsScreenShare(callState.callItems));
      const tile = (
        <Tile
          key={id}
          videoTrackState={callItem.videoTrackState}
          audioTrackState={callItem.audioTrackState}
          username={callItem.username}
          isLocalPerson={isLocal(id)}
          isLarge={isLarge}
          callObject={callObject}
          id={id}
          network={callItem.networkChange}
          disableCornerMessage={isScreenShare(id)}
          local={isLocal(id) ? true : false}
        />
      );
      if (isLarge) {
        largeTiles.push(tile);
      } else {
        smallTiles.push(tile);
      }
    });
    return [largeTiles, smallTiles];
  }

  const [largeTiles, smallTiles] = getTiles();
  const message = getMessage(callState);
  if (message && message.detail === "copyurl") {
    message.detail = props.roomUrl;
  }
  return (
    <div className="call">
      <div className="large-tiles">{!message ? largeTiles : null}</div>
      <div className="small-tiles">{smallTiles}</div>
      {/* If there is some error or only one participate is in call, display message accordingly in center of screen*/}
      {message && (
        <CallMessage
          header={message.header}
          detail={message.detail}
          isError={message.isError}
        />
      )}
    </div>
  );
}
