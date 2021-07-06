import React, { useReducer, useEffect, useState } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { Button, Header, Icon, Card, Modal,  TransitionablePortal,
 } from 'semantic-ui-react'



// Define the steps
const TOUR_STEPS = [
  {
    target: ".tray-button-camera",
    content: "Use this to toggle camera state",
    disableBeacon: true,
  },
  {
    target: ".tray-button-mic",
    content:"Use this to toggle microphone state",
  },
  {
    target: ".tray-button-screenshare",
    content: "Share your entire screen/a window/a tab",
  },
  {
    target: ".tray-button-chat",
    content: "Send a message to all the participants in the room.",
  },  
  {
    target: ".tray-button-info",
    content: "You can find the room url here and copy and share it with others to join.",
  },  
  {
    target: ".tour",
    content: "Come here if you need a walkthrough of the features available on the website",
  },  
  {
    target: ".tray-button-leave",
    content: "Leave the current meeting",
  },
];

// Define our state
const INITIAL_STATE = {
  key: new Date(),
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: TOUR_STEPS,
};

// Set up the reducer function
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "START":
      return { ...state, run: true };
    case "RESET":
      return { ...state, stepIndex: 0 };
    case "STOP":
      return { ...state, run: false };
    case "NEXT_OR_PREV":
      return { ...state, ...action.payload };
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      };
    default:
      return state;
  }
};

// Define the Tour component
const Tour = () => {
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);
   const [open, setOpen] = React.useState(false);
   const[duration,setDur] =React.useState(800);
 const [visit,setVisit] = React.useState(localStorage.getItem("visit"));
  const callback = (data) => {
    const { action, index, type, status } = data;
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      });
    }
  };
      const closeOverlay = () => setOpen(false);
	const animation='zoom';
	  const startTour = () => {
	  setOpen(false);
	  localStorage.setItem("visit","notfirst");
	setVisit("notfirst");
    dispatch({ type: "RESTART" });
  };
   const configs = {
        animate: true,
        escapeDismiss: true,
         focusOutline: true,
    };
    
    
  return (
    <>
    {visit==="first"?(
    
    <TransitionablePortal open={visit==='first'} transition={{ animation, duration }}>
    <Modal open={true} size='tiny' style={{ marginLeft: '35.5em', marginTop:'7em', height:'14em'}}>
    <Header icon>
      <Icon name='reddit alien' />
      New to this site? Let's show you around!
    </Header>
    <Modal.Actions>
    <Button primary onClick={ () => startTour() }>Start tour</Button>
    <Button secondary  onClick={ () => {setVisit("notfirst");	 localStorage.setItem("visit","notfirst");}} >Nah I'll pass</Button>
    </Modal.Actions>
     </Modal>
    </TransitionablePortal>
    
    ):(
        
     <TransitionablePortal open={open} transition={{ animation, duration }}  trigger={
          <Button color = 'violet' style={{marginLeft:'1em'}} className="tour" content={'Features tour'} onClick={() => setOpen(true)} /> }>  
     <Modal open={true} size='tiny' style={{ marginLeft: '35.5em', marginTop:'7em', height:'14em'}} >
    <Header icon>
      <Icon name='reddit alien' />
      New to this site? Let's show you around!
    </Header>
    <Modal.Actions>
    <Button primary onClick={ () => startTour() }>Start tour</Button>
    <Button secondary  onClick={ () => setOpen(false)} >Nah I'll pass</Button>
    </Modal.Actions>
   </Modal>
   </TransitionablePortal>)
 
 }
      <JoyRide {...tourState} callback={callback} showSkipButton={true}  styles={{tooltipContainer: {textAlign: "left",},buttonBack: {marginRight: 10, },buttonSkip: {
      color: 'blue',
      fontSize: 14,
    },}}
        locale={{last: "End tour",}}/>
    </>
  );
};
export default Tour;

