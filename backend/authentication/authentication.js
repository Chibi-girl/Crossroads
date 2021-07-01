import mongoose from "mongoose";
import 'dotenv/config';
const fetch = require("node-fetch");
const users = require("../models/user_model.js");

exports.loggingUser = async (req, res) => {
  if (req.body.status === "logging in") {
    let password = req.body.password;
    await users.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      } else if (user === null) {
        res.status(401).send("You haven't registered. Sign in first");
      } else {
        if (user.password === password) {
          users
            .findOneAndUpdate(
              { email: req.body.email },
              { status: "logged in" },
              { useFindAndModify: false }
            )
            .then((data) => {
              if (!data) {
                res
                  .status(404)
                  .send("Cannot update status . Maybe user was not found!");
              } else {
                console.log(data);
                res.status(200).send(user);
              }
            })
            .catch((err) => {
              res.status(404).send("Error updating user log-in status");
            });
        } else {
          res.status(403).send("Wrong password. Try again!");
        }
      }
    });
  } else {
    users
      .findOneAndUpdate(
        { email: req.body.email },
        { status: "logged out" },
        { useFindAndModify: false }
      )
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send("Cannot update status . Maybe user was not found!");
        } else {
          console.log(data);
          res.status(201).send("User logged out successfully.");
        }
      })
      .catch((err) => {
        res.status(404).send("Error updating user log-in status");
      });
  }
};

exports.registerUser = async (req, res) => {
  let obj = {
    user_name: req.body.username,
    status: "logged in",
    password: req.body.password,
    email: req.body.email,
  };
  users.find({ email: req.body.email }, (err, user) => {
    if (!user.length) {
      let new_user = new users(obj);
      if (!new_user) {
        return res.status(404).json({ success: false, error: "Schema failed" });
      }
      new_user
        .save()
        .then(() => {
          return res.status(201).send(new_user);
        })
        .catch((error) => {
          return res.status(404).send("Error: New user registration not done.");
        });
    } else {
      res.status(400).send("User already exits.");
    }
  });
};

exports.getRoom = async (req,res) => {
const exp = Math.round(Date.now() / 1000) + 6 * 30;
const newRoomEndpoint ="https://api.daily.co/v1/rooms"
  const options = {
    properties: {
      exp: exp,
    },
  };
  const headers = {
  Authorization: `${process.env.DAILY_API_KEY}`
  };
  let response = await fetch(newRoomEndpoint, {
    method: 'POST',
    headers: {'Authorization': `Bearer ${process.env.DAILY_API_KEY}`},
    body: JSON.stringify(options),
    mode: 'cors',
  }),
    room = await response.json();
    
  return res.status(200).send(room);

};
