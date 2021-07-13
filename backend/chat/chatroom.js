import mongoose from "mongoose";
import "dotenv/config";
const fetch = require("node-fetch");
const users = require("../models/user_model.js");
const chats = require("../models/chat_model.js");

//searching a user in database based on email and adding roomId to the list of rooms he has ever joined
exports.joinRoom = async (req, res) => {
  await users
    .findOneAndUpdate(
      { email: req.body.email },
      { $push: { rooms: req.body.room } },
      { useFindAndModify: false }
    )
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send("Cannot update status . Maybe user was not found!");
      } else {
        //console.log(data);
        res.status(201).send("Room id added to user's room-list");
      }
    })
    .catch((err) => {
      res.status(404).send("Error updating room list");
    });
};

/*searching for a chat thread according to roomId
 * and pushing a message to the chat room thread along with the username and email of person sending the message.
 * If chat room doesn't exist in database. create thread with empty arrays.
 */
exports.pushMessageToRoom = async (req, res) => {
  chats.find({ roomId: req.body.roomId }, (err, thread) => {
    if (!thread.length) {
      let obj = {
        roomId: req.body.roomId,
        username: [],
        email: [],
        msg: [],
      };
      let chat = new chats(obj);
      if (!chat) {
        return res.status(404).json({ success: false, error: "Schema failed" });
      }
      chat
        .save()
        .then(() => {
          return res.status(201).send(chat);
        })
        .catch((error) => {
          return res.status(404).send("Error: New chat room not created.");
        });
    } else {
      chats
        .findOneAndUpdate(
          { roomId: req.body.roomId },
          {
            $push: {
              username: req.body.username,
              msg: req.body.msg,
              email: req.body.email,
            },
          },
          { useFindAndModify: false }
        )
        .then((data) => {
          if (!data) {
            res.status(404).send("Cannot add chat by user!");
          } else {
            console.log(data);
            res.status(201).send("Chat successfully pushed to thread");
          }
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  });
};

// getting all chat threads user has engaged in
exports.getUserChats = async (req, res) => {
  var email = req.params.email;
  await users.aggregate(
    [
      { $match: { email: req.params.email } },
      {
        $lookup: {
          from: "chats",
          localField: "rooms",
          foreignField: "roomId",
          as: "chatlist",
        },
      },
      { $unset: ["email", "user_name", "visit", "password", "status", "_id"] },
    ],
    (err, chatList) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!chatList.length) {
        return res.status(200).send(email + " doesn't have chats");
      } else {
        return res.status(200).send(chatList[0]);
      }
    }
  );
};

//creating a room with the url given from frontend, using the daily api

exports.getRoom = async (req, res) => {
  const exp = Math.round(Date.now() / 1000) + 10 * 30;
  const newRoomEndpoint = "https://api.daily.co/v1/rooms";
  const options = {
    properties: {
      exp: exp,
    },
  };
  const headers = {
    Authorization: `${process.env.DAILY_API_KEY}`,
  };
  let response = await fetch(newRoomEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
      body: JSON.stringify(options),
      mode: "cors",
    }),
    room = await response.json();

  return res.status(200).send(room);
};
