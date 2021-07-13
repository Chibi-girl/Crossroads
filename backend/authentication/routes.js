const express = require("express");
const Authenticate = require("./authentication");
const router = express.Router();
//send routed calls to respective functions
router.post("/loggingUser", Authenticate.loggingUser);
router.post("/registerUser", Authenticate.registerUser);

module.exports = router;
