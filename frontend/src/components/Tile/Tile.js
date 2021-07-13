import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import "./Tile.css";
import { Icon, Input, Button, Transition } from "semantic-ui-react";

/* generating message based on participant's audio, video track status */
function getTrackUnavailableMessage(kind, trackState) {
  if (!trackState) return;
  switch (trackState.state) {
    case "blocked":
      if (trackState.blocked.byPermissions) {
        return `${kind} permission denied`;
      } else if (trackState.blocked.byDeviceMissing) {
        return `${kind} device missing`;
      }
      return `${kind} blocked`;
    case "off":
      if (trackState.off.byUser) {
        return `${kind} muted`;
      } else if (trackState.off.byBandwidth) {
        return `${kind} muted to save bandwidth`;
      }
      return `${kind} off`;
    case "sendable":
      return `${kind} not subscribed`;
    case "loading":
      return `${kind} loading...`;
    case "interrupted":
      return `${kind} interrupted`;
    case "playable":
      return null;
  }
}

/**
 * Props
 * - videoTrackState: DailyTrackState?
 * - audioTrackState: DailyTrackState?
 * - isLocalPerson: boolean
 * - isLarge: boolean
 * - disableCornerMessage: boolean
 * - onClick: Function
 */
export default function Tile(props) {
  const videoEl = useRef(null);
  const audioEl = useRef(null);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const videoTrack = useMemo(() => {
    return props.videoTrackState && props.videoTrackState.state === "playable"
      ? props.videoTrackState.track
      : null;
  }, [props.videoTrackState]);

  const audioTrack = useMemo(() => {
    return props.audioTrackState && props.audioTrackState.state === "playable"
      ? props.audioTrackState.track
      : null;
  }, [props.audioTrackState]);

  const videoUnavailableMessage = useMemo(() => {
    return getTrackUnavailableMessage("video", props.videoTrackState);
  }, [props.videoTrackState]);

  const audioUnavailableMessage = useMemo(() => {
    return getTrackUnavailableMessage("audio", props.audioTrackState);
  }, [props.audioTrackState]);

  /**
   * When video track changes, update video srcObject
   */
  useEffect(() => {
    videoEl.current &&
      (videoEl.current.srcObject = new MediaStream([videoTrack]));
  }, [videoTrack]);

  /**
   * When audio track changes, update audio srcObject
   */
  useEffect(() => {
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([audioTrack]));
  }, [audioTrack]);

  const handleChange = (event) => {
    setMsg(event.target.value);
  };
  function getVideoComponent() {
    return videoTrack && <video autoPlay muted playsInline ref={videoEl} />;
  }

  function getAudioComponent() {
    return (
      !props.isLocalPerson &&
      audioTrack && <audio autoPlay playsInline ref={audioEl} />
    );
  }

  function getOverlayComponent() {
    // Show overlay when video is unavailable. Audio may be unavailable too.
    return (
      videoUnavailableMessage && (
        <p className="overlay">
          {videoUnavailableMessage}
          {audioUnavailableMessage && (
            <>
              <br />
              {audioUnavailableMessage}
            </>
          )}
        </p>
      )
    );
  }

  function getCornerMessageComponent() {
    // Show corner message when only audio is unavailable.
    return (
      !props.disableCornerMessage &&
      audioUnavailableMessage &&
      !videoUnavailableMessage && (
        <p className="corner">{audioUnavailableMessage}</p>
      )
    );
  }
  //send unicast (private dm) to a participant
  const sendHello = (participantId) => {
    console.log(msg);
    props.callObject.sendAppMessage({ message: msg }, participantId);
    setMsg("");
  };

  const duration = 800;
  function getClassNames() {
    let classNames = "tile";
    classNames += props.isLarge ? " large" : " small";
    props.isLocalPerson && (classNames += " local");
    return classNames;
  }
  if (props.username !== null) {
    if (props.local === false) {
      //display the unicast message icon on tile only for non-local participants
      return (
        <div className={getClassNames()} onClick={props.onClick}>
          <div className="background" />
          {getOverlayComponent()}
          {getVideoComponent()}
          {getAudioComponent()}

          <Transition visible={open} animation="slide left" duration={duration}>
            <div className="topcorner">
              <Input
                placeholder="send private message"
                onChange={handleChange}
                value={msg}
              ></Input>
              <Button
                color="blue"
                onClick={() => sendHello(props.id)}
                style={{ marginLeft: "0.8em" }}
              >
                Send unicast
              </Button>
              <Icon
                link
                color="red"
                name="cancel"
                style={{ marginLeft: "0.8em" }}
                onClick={() => setOpen(false)}
              />
            </div>
          </Transition>

          {open === true ? null : (
            <Icon
              name="send"
              size="big"
              link
              onClick={() => setOpen(true)}
              className="bottomicon"
            />
          )}
          {getCornerMessageComponent()}
          {props.network === "good" ? null : (
            <div className="bottomcorner">
              <p>
                Participant's net quality is bad. Might be unable to see/hear
                you
              </p>
            </div>
          )}
        </div>
      );
    } else {
      //display message if participant's net quality is bad on bottom right corner
      return (
        <div className={getClassNames()} onClick={props.onClick}>
          <div className="background" />
          {getOverlayComponent()}
          {getVideoComponent()}
          {getAudioComponent()}
          {getCornerMessageComponent()}
          {props.network === "good" ? null : (
            <div className="bottomcorner">
              <p>
                Participant's net quality is bad. Might be unable to see/hear
                you
              </p>
            </div>
          )}
        </div>
      );
    }
  } else {
    return null;
  }
}
