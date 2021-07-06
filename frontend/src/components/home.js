import React, { useEffect, useState, useCallback } from 'react';
import Lottie from "react-lottie";
import {withRouter} from "react-router-dom";
import * as loading from "../animations/loading.json";
import * as success from "../animations/success.json";
import './Callpage.css';
import axios from "axios";
import {Button,Container,Divider,Grid,Header,Image,List,Menu,Segment,Visibility,} from 'semantic-ui-react'
import HomepageHeading from "./homepage_heading";
import Navigation from "./navigation";
import Call from './Call/Call';
import Tray from './Tray/Tray';
import CallObjectContext from '../CallObjectContext';
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from '../urlUtils';
import { createMedia } from '@artsy/fresnel'
import DailyIframe from '@daily-co/daily-js';
import { logDailyEvent } from '../logUtils';

const STATE_IDLE = 'STATE_IDLE';
const STATE_CREATING = 'STATE_CREATING';
const STATE_JOINING = 'STATE_JOINING';
const STATE_JOINED = 'STATE_JOINED';
const STATE_LEAVING = 'STATE_LEAVING';
const STATE_ERROR = 'STATE_ERROR';

const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: loading.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: success.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})


function Home() {
    const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState(null);
    const [copyUrl, setCopyUrl] = useState(null);
    const [loading, setLoading] = useState(false);
  const [callObject, setCallObject] = useState(null);
    const [fixed, setFixed] = useState(null);
  
    const hideFixedMenu = () => setFixed(  false );
  const showFixedMenu = () => setFixed( true );
  
	const handleCallback = (name) =>{
					setLoading(true);
                    createCall().then((url) => {startJoiningCall(url);});
    }
    
   const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
    return axios
        .get("http://localhost:8080/createroom")
        .then((response) => response.data.url)
        .catch((error) =>{
        setRoomUrl(null);
        setAppState(STATE_IDLE);
		console.log(error)
        });
  }, []);

  /**
   * Starts joining an existing call.
   *
   * NOTE: In this demo we show how to completely clean up a call with destroy(),
   * which requires creating a new call object before you can join() again.
   * This isn't strictly necessary, but is good practice when you know you'll
   * be done with the call object for a while and you're no longer listening to its
   * events.
   */
  const startJoiningCall = useCallback((url) => {
  	setLoading(true);
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCopyUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE_JOINING);
    newCallObject.join({ url });
  }, []);

  /**
   * Starts leaving the current call.
   */
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
   *
   * This demo uses replaceState rather than pushState in order to avoid a bit
   * of state-management complexity. See the comments around enableCallButtons
   * and enableStartButton for more information.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.href) return;
    window.history.replaceState(null, null, pageUrl);
  }, [roomUrl]);

  /**
   * Uncomment to attach call object to window for debugging purposes.
   */
  // useEffect(() => {
  //   window.callObject = callObject;
  // }, [callObject]);

  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: Here we're showing how to completely clean up a call with destroy().
   * This isn't strictly necessary between join()s, but is good practice when
   * you know you'll be done with the call object for a while and you're no
   * longer listening to its events.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = ['joined-meeting', 'left-meeting', 'error'];

    function handleNewMeetingState(event) {
      event && logDailyEvent(event);
      switch (callObject.meetingState()) {
        case 'joined-meeting':
          setAppState(STATE_JOINED);
          break;
        case 'left-meeting':
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setLoading(false);
            setCallObject(null);
            setAppState(STATE_IDLE);
          });
          break;
        case 'error':
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }

    // Use initial state
    handleNewMeetingState();

    // Listen for changes in state
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

    callObject.on('app-message', handleAppMessage);

    return function cleanup() {
      callObject.off('app-message', handleAppMessage);
    };
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or are showing
   * an error.
   */
  const showCall = [ STATE_JOINED, STATE_ERROR].includes(
    appState
  );

  /**
   * Only enable the call buttons (camera toggle, leave call, etc.) if we're joined
   * or if we've errored out.
   *
   * !!!
   * IMPORTANT: calling callObject.destroy() *before* we get the "joined-meeting"
   * can result in unexpected behavior. Disabling the leave call button
   * until then avoids this scenario.
   * !!!
   */
  const enableCallButtons = [STATE_JOINED, STATE_ERROR].includes(appState);

  /**

   * !!!
   * IMPORTANT: only one call object is meant to be used at a time. Creating a
   * new call object with DailyIframe.createCallObject() *before* your previous
   * callObject.destroy() completely finishes can result in unexpected behavior.
   * Disabling the start button until then avoids that scenario.
   * !!!
   */
  /*const enableStartButton = appState === STATE_IDLE;*/
  
    
	 if(!showCall) 
	 {
	 if(!loading)
	 {
    return (
      <MediaContextProvider>
      <Media greaterThan='mobile'>
        <Visibility
          once={false}
          onBottomPassed={showFixedMenu}
          onBottomPassedReverse={hideFixedMenu}
        >
          <Segment
          inverted color="teal"
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
          <Segment 
          inverted color="black">
            <Menu
            inverted
              fixed={fixed ? 'top' : null}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
  			<Navigation active="home" parentCallback = {handleCallback} parentCallback2 = {startJoiningCall}/>
            </Menu>
            </Segment>
            <HomepageHeading />
          </Segment>
        </Visibility>
      </Media>
      <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
       <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
              We value your privacy
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            Crossroads uses stringent security measures to protect your information and privacy. Video conferences on CrossRoads are encrypted during transit. 
            Our security measures are constantly updated to give you better protection.
            </p>
            <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
			 One stop solution for all : businesses and individual alike.  
            </Header>
            <p style={{ fontSize: '1.33em' }}>
			The website has been structured so that it strikes a balance between a homely environment and corporate feel. 
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src='/images/logo.jpg' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em', fontStyle: 'italic' }}>
              "Fluid interface. Seamless connectivity"
            </Header>
            <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em', fontStyle: 'italic' }}>
              "It's a great enough website to make me want to use it as my goto platform for video and audio online calls"
            </Header>
            <p style={{ fontSize: '1.33em' }}>
             Not-so Anonymous User
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' ,color:'purple'}}>
          Meet your friends and loved ones. Ace that meeting.
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Invite your clan to this platform. Present your documents, or send that secret message. Our rooms are big enough to accomodate 500 folks at a go, so get that party, (or presentation =3 ) started.
        </p>
        <Button as='a' size='large'>
          Read More
        </Button>

        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>Move to top</a>
        </Divider>

        <Header as='h3' style={{ fontSize: '2em',color:'purple' }}>
          Quality Assured. And peace of mind.
        </Header>
        <p style={{ fontSize: '1.33em' }}>
     			Now you don't have to get all jittery about a fluctuating network; CrossRoads adapts itself according to the quality of your net connection. It holds on till the very end, making sure you can have as seamless an experience as possible .
        </p>
        <Button as='a' size='large'>
			Might need this in the future
        </Button>
      </Container>
    </Segment>

    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Our Team</List.Item>
                <List.Item as='a'>Future Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>See Plans and Prices</List.Item>
                <List.Item as='a'>FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Use Premium</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
				Copyright @Crossroads
              </Header>
              <p>
				Sole ownership of this website belongs to chibi-girl. Mail me at lucysanzenin@gmail.com if you have any queries/complaints. 
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
        </MediaContextProvider>
        
    )
    }
    else
    {
    return(
    <Lottie options={defaultOptions1} height={600} width={600} />
    )
    }
    }
    else
    {
     return (
         <div className="callpage">
        <CallObjectContext.Provider value={callObject}>
          <Call roomUrl={copyUrl} />
          <Tray roomUrl={copyUrl}
            disabled={!enableCallButtons}
            onClickLeaveCall={startLeavingCall}
          />
        </CallObjectContext.Provider>
        </div>
        
     );
    }
}





export default withRouter(Home);
