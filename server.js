const express = require("express");
const mongoose = require("mongoose");
// const { mongodbURL } = require("./env");
const app = express();
const cors = require("cors");
const signUpRoute = require("./routes/signUpRoute");
const loginRoute = require("./routes/loginRoute");
const dotenv = require("dotenv");

// server.listen(3000);

dotenv.config();

app.use(express.json());

app.use(cors({}));

app.use("/signup", signUpRoute);
app.use("/login", loginRoute);

//socketio
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

io.on("connection", (socket) => {
  console.log("hi");
  io.emit("test", "hello");
});

// const io = require("socket.io")(
//   server,
//   {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//       allowedHeaders: ["my-custom-header"],
//     },
//   },
//   (socket) => {
//     io.on("connection", () => {
//       console.log("hi");
//       socket.emit("hi", "hi");
//     });
//   }
//   socket.on("connection", ({ name, message }) => {
//     console.log("hi");
//   });
// }
// );

// connect to database
let port = process.env.PORT;
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    server.listen(port, () => console.log("Listening to port " + port))
  )
  .catch((err) => {
    console.log(err);
  });
