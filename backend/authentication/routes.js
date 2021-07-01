const express = require("express");
const Authenticate = require("./authentication");
const router = express.Router();

router.post("/loggingUser", Authenticate.loggingUser);
router.post("/registerUser", Authenticate.registerUser);
router.get("/createroom",Authenticate.getRoom)

module.exports = router;
