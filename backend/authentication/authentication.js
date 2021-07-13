import mongoose from "mongoose";
import "dotenv/config";

const fetch = require("node-fetch");
const users = require("../models/user_model.js");

//logging in user with the credentials provided. If email is not found or password of document mismatches, send error message
exports.loggingUser = async (req, res) => {
  if (req.body.status === "logging in") {
    //if user is logging in
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
                // console.log(data);
                res.status(200).send(data);
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
    //user is logging out. Just email is required to set the status in the document
    users
      .findOneAndUpdate(
        { email: req.body.email },
        { $set: { status: "logged out", visit: "notfirst" } },
        { useFindAndModify: false }
      )
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send("Cannot update status . Maybe user was not found!");
        } else {
          res.status(201).send(data);
        }
      })
      .catch((err) => {
        res.status(404).send("Error updating user log-in status");
      });
  }
};

//register a new user with credentials. If email already exists in database, send error message
exports.registerUser = async (req, res) => {
  let obj = {
    user_name: req.body.username,
    status: "logged in",
    visit: "first",
    rooms: [],
    password: req.body.password,
    email: req.body.email,
  };
  users.find({ email: req.body.email }, (err, user) => {
    if (!user.length) {
      //no user with that email exists. It's okay to create a new profile.
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
      //email already in use. Send error message.
      res.status(400).send("User already exits.");
    }
  });
};
