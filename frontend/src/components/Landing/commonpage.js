import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Grid,
  Header,
  List,
  Menu,
  Segment,
  Visibility,
} from "semantic-ui-react";
import Lottie from "react-lottie";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DailyIframe from "@daily-co/daily-js";

import * as loading from "../../animations/loading.json";
import "./Callpage.css";
import HomepageHeading from "./homepage_heading";
import Navigation from "./navigation";
import Call from "../Call/Call";
import Tray from "../Tray/Tray";
import Error from "../ErrorPage/error";
import CallObjectContext from "../../GlobalContext/CallObjectContext";
import userContext from "../../GlobalContext/userContext";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "../../Utils/urlUtils";
import { logDailyEvent } from "../../Utils/logUtils";

const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_LEAVING = "STATE_LEAVING";
const STATE_ERROR = "STATE_ERROR";

const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: loading.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Home(props) {
  const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState(null);
  const [copyUrl, setCopyUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callObject, setCallObject] = useState(null);
  const [fixed, setFixed] = useState(null);

  const hideFixedMenu = () => setFixed(false);
  const showFixedMenu = () => setFixed(true);

  const handleCallback = () => {
    setLoading(true);
    createCall();
  };

  const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
    axios
      .get("https://cross-roads.herokuapp.com/createroom")
      .then((response) => {
        startJoiningCall(response.data.url);
        const payload = { roomId: response.data.url.substring(28) };
        axios
          .post("https://cross-roads.herokuapp.com/addchat", payload)
          .then((res) => {
            if (res.status === 201) {
              console.log(res.data);
            } else {
              console.log("Some error ocurred");
            }
          })
          .catch((err) => {
            setRoomUrl(null);
            setAppState(STATE_IDLE);
            console.log(err);
          });
      })
      .catch((error) => {
        setRoomUrl(null);
        setAppState(STATE_IDLE);
        console.log(error);
      });
  }, []);

  /* Starts joining an existing call.*/
  const startJoiningCall = useCallback((url) => {
    setLoading(true);
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCopyUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE_JOINING);
    newCallObject.join({ url });
  }, []);

  /* Starts leaving the current call.*/
  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    // If we're in the error state, we've already "left", so just clean up
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE_IDLE);
      });
    } else {
      setAppState(STATE_LEAVING);
      setLoading(false);
      callObject.leave();
    }
  }, [callObject, appState]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    url && startJoiningCall(url);
  }, [startJoiningCall]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.href) return;
    window.history.replaceState(null, null, pageUrl);
  }, [roomUrl]);

  /**
   * Update app state based on reported meeting state changes.
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }

    const events = ["joined-meeting", "left-meeting", "error"];

    function handleNewMeetingState(event) {
      event && logDailyEvent(event);
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE_JOINED);
          callObject.setUserName(userContext.getName(), {
            thisMeetingOnly: true,
          });
          const payload = {
            email: userContext.getEmail(),
            room: copyUrl.substring(28),
          };
          axios /* when user has joined room, add url to list of rooms user has joined in database */
            .post("https://cross-roads.herokuapp.com/joinedroom", payload)
            .then((response) => {
              if (response.status === 201) {
                console.log(response.data);
              } else {
                console.log("Some error ocurred");
              }
            });
          break;
        case "left-meeting" /* destroy call object completely on leaving meeting to make sure we aren't unnecessarily listening to event changes*/:
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setLoading(false);
            setCallObject(null);
            setAppState(STATE_IDLE);
          });
          break;
        case "error":
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }

    // Use initial state
    handleNewMeetingState();

    // Listen for changes in state, and call handleNewMeetingState when an even occurs
    for (const event of events) {
      callObject.on(event, handleNewMeetingState);
    }

    // Stop listening for changes in state
    return function cleanup() {
      for (const event of events) {
        callObject.off(event, handleNewMeetingState);
      }
    };
  }, [callObject]);

  /**
   * Listen for app messages from other call participants.
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }
    function handleAppMessage(event) {
      if (event) {
        logDailyEvent(event);
        console.log(`received app message from ${event.fromId}: `, event.data);
      }
    }
    callObject.on("app-message", handleAppMessage);

    return function cleanup() {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or are showing
   * an error.
   */
  const showCall = [STATE_JOINED, STATE_ERROR].includes(appState);

  /**
   * Only enable the call buttons (camera toggle, leave call, etc.) if we're joined
   * or if we've errored out.
   *Since calling callObject.destroy() *before* we get the "joined-meeting"
   * can result in unexpected behavior, we disable the leave call button
   * until then to avoid this scenario.
   */
  const enableCallButtons = [STATE_JOINED, STATE_ERROR].includes(appState);

  //if we aren't in call, show landing page
  if (!showCall) {
    if (!loading) {
      return (
        <div>
          <Visibility
            once={false}
            onBottomPassed={showFixedMenu}
            onBottomPassedReverse={hideFixedMenu}
          >
            <Segment
              className="seg"
              inverted
              color="teal"
              textAlign="center"
              style={{ minHeight: 600, padding: "1em 0em" }}
              vertical
            >
              <Segment inverted color="black">
                <Menu
                  stackable
                  inverted
                  fixed={fixed ? "top" : null}
                  pointing={!fixed}
                  secondary={!fixed}
                  size="large"
                >
                  <Navigation //Navigation bar for landing page showing currently active page as homepage or usage-steps page
                    active={props.active}
                    parentCallback={handleCallback}
                    parentCallback2={startJoiningCall}
                  />
                </Menu>
              </Segment>
              <HomepageHeading />
            </Segment>
          </Visibility>

          {props.curr}

          <Segment inverted vertical style={{ padding: "5em 0em" }}>
            <Container>
              <Grid divided inverted stackable>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <Header inverted as="h4" content="About" />
                    <List link inverted>
                      <List.Item as="a">Sitemap</List.Item>
                      <List.Item as="a">Contact Us</List.Item>
                      <List.Item as="a">Our Team</List.Item>
                      <List.Item as="a">Future Plans</List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <Header inverted as="h4" content="Services" />
                    <List link inverted>
                      <List.Item as="a">See Plans and Prices</List.Item>
                      <List.Item as="a">FAQ</List.Item>
                      <List.Item as="a">How To Access</List.Item>
                      <List.Item as="a">Use Premium</List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <Header as="h4" inverted>
                      Copyright @Crossroads
                    </Header>
                    <p>
                      Sole ownership of this website belongs to chibi-girl. Mail
                      me at lucysanzenin@gmail.com if you have any
                      queries/complaints.
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </Segment>
        </div>
      );
    } // if we are currently not in a call, nor in the landing page, i.e we are joining a call, show loading component
    else {
      return <Lottie options={defaultOptions1} height={600} width={600} />;
    }
  } // if we are in a call, show call-UI
  else {
    if (callObject.meetingState() === "joined-meeting") {
      return (
        <div className="callpage">
          {/* setting global context of callObject to be used by children */}
          <CallObjectContext.Provider value={callObject}>
            <Call roomUrl={copyUrl.substring(28)} />
            {/* send only room code and not entire url to tray and call page for displaying */}
            <Tray
              roomUrl={copyUrl.substring(28)}
              disabled={!enableCallButtons}
              onClickLeaveCall={startLeavingCall}
            />
          </CallObjectContext.Provider>
        </div>
      );
    } // error occurred while joining a room url due to invalid joining url or expired link.
    else {
      return <Error error="true" />;
    }
  }
}

export default withRouter(Home);
