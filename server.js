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
    origin: "http://localhost:3000", // origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

io.on("connection", (socket) => {
  console.log("User joined.");
  socket.on("disconnected", () => {
    console.log("User disconnected.");
  });

  socket.on("sendMessage", (msg) => {
    console.log(msg);
    socket.broadcast.emit("receiveMessage", msg);
  });

  // io.emit("test", "welcome");
  // socket.broadcast.emit("userConnected", "User");
  // socket.on("send-message", (data) => {
  //   console.log(data);
  //   socket.broadcast.emit("message", data);
  //   //^ sends data to every user except user who sent the data
  // });
});

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
