import React, { useContext, useState, useEffect } from "react";
import { Comment, Card, Input, Icon, Transition } from "semantic-ui-react";
import axios from "axios";

import CallObjectContext from "../../GlobalContext/CallObjectContext";
import userContext from "../../GlobalContext/userContext";

export default function Chat(props) {
  const callObject = useContext(CallObjectContext);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const animation = "slide left";
  const duration = 800;
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  function handleSubmit(event) {
    // fired when send message icon is clicked
    event.preventDefault();
    callObject.sendAppMessage({ message: inputValue }, "*");
    const name = callObject.participants().local.user_name
      ? callObject.participants().local.user_name
      : localStorage.getItem("username");
    setChatHistory([
      ...chatHistory,
      {
        sender: name,
        message: inputValue,
      },
    ]);
    setInputValue("");
    const payload = {
      email: userContext.getEmail(),
      username: name,
      msg: inputValue,
      roomId: props.url,
    };
    axios // while updating chat list in frontend, send message to be stored in database for post meet chat
      .post("https://cross-roads.herokuapp.com/addchat", payload)
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data);
        } else {
          console.log("Some error ocurred");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Update chat state based on a message received to all participants.
   *
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }

    function handleAppMessage(event) {
      const participants = callObject.participants();
      const name = participants[event.fromId].user_name
        ? participants[event.fromId].user_name
        : "Guest";
      setChatHistory([
        ...chatHistory,
        {
          sender: name,
          message: event.data.message,
        },
      ]);
      // Make other icons light up
      props.notification();
    }

    callObject.on("app-message", handleAppMessage);

    return function cleanup() {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject, chatHistory]);

  useEffect(() => {}, [chatHistory]);

  return (
    <Transition
      visible={props.onClickDisplay}
      animation={animation}
      duration={duration}
    >
      <Card
        style={{
          overflow: "auto",
          padding: "0.4em",
          position: "absolute",
          right: "10px",
          bottom: "75px",
          width: "250px",
          height: "40em",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <Card.Content
          style={{
            overflow: "auto",
            position: "relative",
            top: "0px",
            bottom: "36px",
          }}
        >
          {chatHistory.map(
            (
              entry,
              index //map current chat list to be displayed within a card on frontend
            ) => (
              <Comment>
                <Comment.Content
                  key={`entry-${index}`}
                  style={{ padding: "0.6em" }}
                >
                  <Comment.Author as="a">{entry.sender}</Comment.Author>
                  <Comment.Text>{entry.message}</Comment.Text>
                </Comment.Content>
              </Comment>
            )
          )}
        </Card.Content>
        <Card.Content>
          <Input
            style={{ position: "fixed", bottom: "77px", height: "34px" }}
            placeholder="Type your message here"
            icon={
              <Icon
                name="send"
                color="blue"
                link
                inverted
                circular
                onClick={handleSubmit}
              />
            }
            value={inputValue}
            onChange={handleChange}
          ></Input>
        </Card.Content>
      </Card>
    </Transition>
  );
}
