const express = require("express");
import "dotenv/config";
var morgan = require("morgan");
let cors = require("cors");
let bodyParser = require("body-parser");

const auth_router = require("./authentication/routes");
const room_router = require("./chat/routes");
const db = require("./connection");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

//show message after connecting to cloud database
db.once("open", () => console.log("Connected to db"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// Set public folder as root

app.use(express.static("public"));

// Provide access to node_modules folder from the client-side
app.use("/scripts", express.static(`${__dirname}/node_modules/`));

app.post("/loggingUser", auth_router);
app.post("/registerUser", auth_router);
app.use("/", room_router);

app.get("/", (_, res) => {
  res.status(200).send("Hello from the profile backend!");
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/frontend/public/index.html`));

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
