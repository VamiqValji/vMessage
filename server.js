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
  // console.log("User joined.");
  let users = [""];

  socket.on("connected", (username) => {
    console.log(`${username} joined.`);
    // if (users.includes(username)) {
    //   username += "_dupe";
    //   socket.emit("changeUsername", username);
    // }
    socket.broadcast.emit("userJoined", username);
    users.push({ id: socket.id, username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected.");
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        socket.broadcast.emit("userLeft", users[i].username);
        // users.filter(users[i].id === socket.id);
        users.splice(i, 1);
        console.log(users);
      }
    }
    if (users.includes(socket.id)) console.log("true");
    // socket.broadcast.emit("userLeft", username);
  });

  socket.on("sendMessage", (msgInfo) => {
    console.log(msgInfo);
    socket.broadcast.emit("receiveMessage", msgInfo);
    //^ sends data to every user except user who sent the data
  });

  // io.emit("test", "welcome");
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
