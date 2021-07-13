const express = require("express");
const Chatroom = require("./chatroom");
const router = express.Router();
//send routed calls to respective functions

router.get("/createroom", Chatroom.getRoom);
router.post("/joinedroom", Chatroom.joinRoom);
router.post("/addchat", Chatroom.pushMessageToRoom);
router.get("/chats/:email", Chatroom.getUserChats);

module.exports = router;
