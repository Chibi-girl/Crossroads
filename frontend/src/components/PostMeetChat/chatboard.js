import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Header,
  Modal,
  Dropdown,
  Comment,
  TransitionablePortal,
} from "semantic-ui-react";
import userContext from "../../GlobalContext/userContext";

function ChatBoard(props) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [done, setDone] = useState(true);
  const [msg, setMsg] = useState([]);
  const [id, setId] = useState("");
  const [roomid, setRoomid] = useState("");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const duration = 800;
  const animation = "fly down";

  const handleChange = (e, { value }) => {
    setInput(value);
  };

  //send chat to be displayed in database and showed on screen
  const handleSubmit = () => {
    const payload = {
      email: userContext.getEmail(),
      username: userContext.getName(),
      msg: input,
      roomId: roomid,
    };
    setDone(false); // button shows loading
    axios //api call to backend to store message in database
      .post("https://cross-roads.herokuapp.com/addchat", payload)
      .then((response) => {
        if (response.status !== 201) {
          console.log("Some error ocurred");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //poll database at intervals of 0.6 seconds to check for new messages
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      axios
        .get(
          "https://cross-roads.herokuapp.com/chats/" + userContext.getEmail()
        )
        .then((response) => {
          if (response.status === 200) {
            userContext.setChat(response.data.chatlist);
            setChat(response.data.chatlist);
            setLoading(false);
            if (done === false) {
              setInput("");
              setDone(true);
            }

            if (id !== "") {
              //set the new message to be displayed on screen if the chatboard is open
              for (let i = 0; i < chat.length; i++) {
                if (id === chat[i].roomId) {
                  setMsg("");
                  for (let j = 0; j < chat[i].email.length; j++) {
                    let newelem = {
                      email: chat[i].email[j],
                      username: chat[i].username[j],
                      msg: chat[i].msg[j],
                    };
                    setMsg((msg) => [...msg, newelem]);
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log("Error getting chatlist");
        });
    }, 600);

    return () => clearInterval(intervalId); //Clear interval call on unmounting
  }, [msg, done, id, chat]);
  return (
    //dropdown displaying all chat room threads of current user
    <div>
      <Dropdown
        icon="chat"
        text="My chats"
        floating
        selection
        labeled
        style={{ marginLeft: "1em", width: "15.3em" }}
        loading={loading}
        disabled={loading}
        className="button icon"
      >
        <Dropdown.Menu style={{ marginLeft: "0em" }}>
          {chat.length === 0 ? ( //display message if user has never joined a room
            <Dropdown.Item text="No chats for current user" />
          ) : (
            chat.map((option) => (
              <Dropdown.Item
                key={option.roomId}
                text={option.roomId}
                onClick={() => {
                  setMsg("");
                  setId(option.roomId);
                  for (let i = 0; i < option.email.length; i++) {
                    let newelem = {
                      email: option.email[i],
                      username: option.username[i],
                      msg: option.msg[i],
                    };
                    setMsg((msg) => [...msg, newelem]);
                    if (i === option.email.length - 1) {
                      setOpen(true);
                    }
                  }
                  if (option.email.length === 0) setOpen(true);
                  setRoomid(option.roomId);
                }}
              />
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
      {/* display chatboard for thread when an option is chosen from dropdown */}
      <TransitionablePortal open={open} transition={{ animation, duration }}>
        <Modal
          open={true}
          size="small"
          style={{ marginLeft: "25.5em", marginTop: "7em", height: "40em" }}
        >
          <Modal.Actions>
            <Button
              secondary
              onClick={() => {
                setOpen(false);
                setId("");
              }}
            >
              Return
            </Button>
          </Modal.Actions>
          <Modal.Content>
            <Comment.Group>
              <Header as="h3" dividing>
                Comments
              </Header>
              {msg.length === 0 ? (
                <p>This thread is empty. Get the conversation started!</p>
              ) : (
                msg.map((chat) => (
                  <Comment>
                    <Comment.Content>
                      <Comment.Author as="a">{chat.username}</Comment.Author>
                      <Comment.Metadata>
                        <div>{chat.email}</div>
                      </Comment.Metadata>
                      <Comment.Text>{chat.msg}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                ))
              )}
              {/* Send new message to the thread */}
              <Form reply>
                <Form.TextArea value={input} onChange={handleChange} />
                <Button
                  primary
                  loading={!done}
                  content="Send Message"
                  labelPosition="left"
                  icon="edit"
                  onClick={handleSubmit}
                />
              </Form>
            </Comment.Group>
          </Modal.Content>
          <Modal.Actions>
            <Button
              secondary
              onClick={() => {
                setOpen(false);
                setId("");
              }}
            >
              Return
            </Button>
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </div>
  );
}

export default ChatBoard;
