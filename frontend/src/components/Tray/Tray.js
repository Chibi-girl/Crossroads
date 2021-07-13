import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Icon,
  Popup,
  Label,
  TransitionablePortal,
} from "semantic-ui-react";
import DailyIframe from "@daily-co/daily-js";
import {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
} from "react-share";

import "./Tray.css";
import Tour from "./tour";
import Chat from "../Call/Chat";
import CallObjectContext from "../../GlobalContext/CallObjectContext";
import { logDailyEvent } from "../../Utils/logUtils";

/**
 * Gets [isCameraMuted, isMicMuted, isSharingScreen].
 * This function is declared outside Tray() so it's not recreated every render
 * (which would require us to declare it as a useEffect dependency).
 */
function getStreamStates(callObject) {
  let isCameraMuted,
    isMicMuted,
    isSharingScreen = false;
  if (
    callObject &&
    callObject.participants() &&
    callObject.participants().local
  ) {
    const localParticipant = callObject.participants().local;
    isCameraMuted = !localParticipant.video;
    isMicMuted = !localParticipant.audio;
    isSharingScreen = localParticipant.screen;
  }
  return [isCameraMuted, isMicMuted, isSharingScreen];
}

/**
 * Props:
 * - onClickLeaveCall: () => ()
 * - disabled: boolean
 */
export default function Tray(props) {
  const callObject = useContext(CallObjectContext);
  const [isCameraMuted, setCameraMuted] = useState(false);
  const [isMicMuted, setMicMuted] = useState(false);
  const [isSharingScreen, setSharingScreen] = useState(false);
  const [displayChat, setChatDisplay] = useState(false);
  const [highlightedChat, setChatHighlight] = useState(false);
  const animation = "zoom";
  const duration = 800;
  function toggleCamera() {
    callObject.setLocalVideo(isCameraMuted);
  }

  function toggleMic() {
    //toggling mic status
    callObject.setLocalAudio(isMicMuted);
  }

  function toggleSharingScreen() {
    //toggling screen share status
    isSharingScreen
      ? callObject.stopScreenShare()
      : callObject.startScreenShare();
  }

  function leaveCall() {
    //leave the current call and return to home page
    props.onClickLeaveCall && props.onClickLeaveCall();
  }

  function toggleChat() {
    //display chat card on right side of page
    setChatDisplay(!displayChat);
    if (highlightedChat) {
      setChatHighlight(!highlightedChat);
    }
  }

  function handleNewChat() {
    //highlight chat icon when new message is broadcast
    setChatHighlight(!highlightedChat);
  }

  /**
   * Start listening for participant changes when callObject is set (i.e. when the component mounts).
   * This event will capture any changes to your audio/video mute state.
   */
  useEffect(() => {
    if (!callObject) return;

    function handleNewParticipantsState(event) {
      event && logDailyEvent(event);
      const [isCameraMuted, isMicMuted, isSharingScreen] =
        getStreamStates(callObject);
      setCameraMuted(isCameraMuted);
      setMicMuted(isMicMuted);
      setSharingScreen(isSharingScreen);
    }

    // Use initial state
    handleNewParticipantsState();

    // Listen for changes in state
    callObject.on("participant-updated", handleNewParticipantsState);

    // Stop listening for changes in state
    return function cleanup() {
      callObject.off("participant-updated", handleNewParticipantsState);
    };
  }, [callObject]);

  return (
    <div className="tray">
      {/* Icons for sharing room code on social media sites*/}
      <FacebookShareButton
        style={{ marginLeft: "28em" }}
        url="https://crossroads-video-conf-site.netlify.app/"
        quote={"Join the room with the code " + props.roomUrl}
      >
        <Popup trigger={<FacebookIcon size={32} round />}>
          <h6>Share room code with people on facebook</h6>
        </Popup>
      </FacebookShareButton>

      <TelegramShareButton
        style={{ marginLeft: "1em" }}
        url="https://crossroads-video-conf-site.netlify.app/"
        title={"Join the room with the code " + props.roomUrl}
      >
        <Popup trigger={<TelegramIcon size={32} round />}>
          <h6>Send room code to people on Telegram</h6>
        </Popup>
      </TelegramShareButton>

      {/* Buttons to toggle camera, mic states*/}
      <Popup
        trigger={
          <Icon
            className="tray-button-camera"
            size="big"
            style={{ marginLeft: "1em" }}
            disabled={props.disabled}
            color={isCameraMuted ? "red" : "blue"}
            onClick={toggleCamera}
            name={isCameraMuted ? "hide" : "video camera"}
          />
        }
      >
        <h6>Toggle camera state</h6>
      </Popup>

      <Popup
        trigger={
          <Icon
            className="tray-button-mic"
            size="big"
            style={{ marginLeft: "1em" }}
            disabled={props.disabled}
            color={isMicMuted ? "red" : "blue"}
            onClick={toggleMic}
            name={isMicMuted ? "microphone slash" : "microphone"}
          />
        }
      >
        <h6>Toggle microphone state</h6>
      </Popup>

      {DailyIframe.supportedBrowser().supportsScreenShare && (
        <Popup
          trigger={
            <Icon
              className="tray-button-screenshare"
              size="big"
              style={{ marginLeft: "1em" }}
              disabled={props.disabled}
              color={isSharingScreen ? "blue" : "grey"}
              onClick={toggleSharingScreen}
              name="desktop"
            />
          }
        >
          {/* Button for Presenting screen*/}
          <h6>Present screen</h6>
        </Popup>
      )}

      <Popup
        trigger={
          <Icon
            className="tray-button-leave"
            style={{ marginLeft: "2em" }}
            disabled={props.disabled}
            color="red"
            size="big"
            name="sign out"
            onClick={leaveCall}
          />
        }
      >
        <h6>Leave this call and return to homepage</h6>
      </Popup>

      <Popup
        trigger={
          <Icon
            className="tray-button-chat"
            size="big"
            style={{ marginLeft: "2em" }}
            disabled={props.disabled}
            onClick={toggleChat}
            color={highlightedChat ? "blue" : "grey"}
            name="rocketchat"
          />
        }
      >
        <h6>Chat with other participants in the call</h6>
      </Popup>

      <Popup
        on="click"
        pinned
        trigger={
          <Button
            style={{ marginLeft: "1.4em" }}
            className="tray-button-info"
            circular
            icon
          >
            <Icon color="blue" name="info" />
          </Button>
        }
      >
        <h5 style={{ textAlign: "center" }}>
          Invite your folks. The more the merrier!
        </h5>
        <Button as="div" labelPosition="left">
          <Label basic pointing="right">
            {props.roomUrl}
          </Label>
          <Button
            color="teal"
            icon
            onClick={() => navigator.clipboard.writeText(props.roomUrl)}
          >
            <Icon name="copy" />
          </Button>
        </Button>
      </Popup>

      <Tour />

      <WhatsappShareButton
        className="share"
        style={{ marginLeft: "1em" }}
        url="https://crossroads-video-conf-site.netlify.app/"
        title={"Join the room with the code " + props.roomUrl}
        separator=":: "
      >
        <Popup trigger={<WhatsappIcon className="share" size={32} round />}>
          <h6>Send room code to people on whastapp</h6>
        </Popup>
      </WhatsappShareButton>
      {/* Chat component integration whose state is toggled when chat button is clicked */}

      <Chat
        onClickDisplay={displayChat}
        notification={handleNewChat}
        url={props.roomUrl}
      />
    </div>
  );
}
