const express = require("express");
const mongoose = require("mongoose");
// const { mongodbURL } = require("./env");
const app = express();
const cors = require("cors");
const signUpRoute = require("./routes/signUpRoute");
const loginRoute = require("./routes/loginRoute");
const friendsRoute = require("./routes/friendsRoute");
const dotenv = require("dotenv");

// server.listen(3000);

dotenv.config();

app.use(express.json());

app.use(cors({}));

app.use("/signup", signUpRoute);
app.use("/login", loginRoute);
app.use("/friends", friendsRoute);

//socketio
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN, // origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

let users = [];
let dmUsers = [];

io.on("connection", (socket) => {
  // console.log("User joined.");

  if (socket.handshake.headers.referer.includes(process.env.DM_ENDPOINT)) {
    let room = "";
    socket.on("connected", (data) => {
      console.log(data);
      room = data.room;
      socket.join(data.room);
      console.log(
        `'${data.username}' joined room '${data.room}' with '${data.currentUser}'.`
      );
      // socket.broadcast.emit("userJoined", username);
      dmUsers.push({ id: socket.id, username: data.username });
      // updatePlayersOnline();
    });

    socket.on("sendMessage", (msgInfo) => {
      console.log(msgInfo);
      socket.to(room).broadcast.emit("receiveMessage", msgInfo);
      //^ sends data to every user except user who sent the data
    });

    socket.on("disconnect", () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === socket.id) {
          // socket.broadcast.emit("userLeft", users[i].username);
          console.log(`${users[i].username} left.`);
          users.splice(i, 1);
          console.log(users);
          // updatePlayersOnline();
        }
      }
      if (users.includes(socket.id)) console.log("true");
      // socket.broadcast.emit("userLeft", username);
    });
  } else if (
    socket.handshake.headers.referer.includes(process.env.PUBLIC_CHAT_ENDPOINT)
  ) {
    const updatePlayersOnline = () => {
      socket.emit("updatePlayersOnline", users.length);
      console.log(users.length);
    };

    socket.on("connected", (username) => {
      console.log(`${username} joined.`);
      // if (users.includes(username)) {
      //   username += "_dupe";
      //   socket.emit("changeUsername", username);
      // }
      socket.broadcast.emit("userJoined", username);
      users.push({ id: socket.id, username });
      updatePlayersOnline();
    });

    socket.on("disconnect", () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === socket.id) {
          socket.broadcast.emit("userLeft", users[i].username);
          // users.filter(users[i].id === socket.id);
          console.log(`${users[i].username} left.`);
          users.splice(i, 1);
          console.log(users);
          // updatePlayersOnline();
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
  }
});

// connect to database
let port = process.env.PORT;
mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then((result) =>
    server.listen(port, () => console.log("Listening to port " + port))
  )
  .catch((err) => {
    console.log(err);
  });
