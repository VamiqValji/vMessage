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
let gamesUsersList = [];

io.on("connection", (socket) => {
  // console.log("User joined.");

  if (socket.handshake.headers.referer.includes(process.env.DM_ENDPOINT)) {
    // const addMessagesToDB = (msgInfo = Object, room = String) => {
    //   console.log("Adding to DB.", msgInfo, room);
    // };

    let room = "";
    socket.on("connected", (data) => {
      // console.log(data);

      let reqUser = data.username;
      let chosenUser = data.currentUser;
      // CONSISTENT ROOM NAMES

      // METHOD #1
      // if (reqUser.length > chosenUser.length) {
      //   room = `${reqUser},${chosenUser}`;
      // } else {
      //   room = `${chosenUser},${reqUser}`;
      // }

      // METHOD #2
      let consistent = [reqUser, chosenUser].sort();
      room = `${consistent[0]},${consistent[1]}`;

      socket.join(room);
      console.log(
        `'${data.username}' joined room '${room}' with '${data.currentUser}'.`
      );
      // socket.broadcast.emit("userJoined", username);
      dmUsers.push({ id: socket.id, username: data.username });
      // updatePlayersOnline();
    });

    socket.on("sendMessage", (msgInfo) => {
      console.log(msgInfo);
      // addMessagesToDB(msgInfo, room);
      // I'LL JUST MAKE A REGULAR POST REQUEST TO UPDATE DB INSTEAD
      // OF UPDATING DB THROUGH A SOCKETIO REQUEST.
      socket.to(room).broadcast.emit("receiveMessage", msgInfo);
      //^ sends data to every user except user who sent the data
    });

    socket.on("disconnect", () => {
      for (let i = 0; i < dmUsers.length; i++) {
        if (dmUsers[i].id === socket.id) {
          // socket.broadcast.emit("userLeft", dmUsers[i].username);
          console.log(`${dmUsers[i].username} left.`);
          dmUsers.splice(i, 1);
          console.log(dmUsers);
          // updatePlayersOnline();
        }
      }
    });
  } else if (
    socket.handshake.headers.referer.includes(process.env.PUBLIC_CHAT_ENDPOINT)
  ) {
    const publicRoom = "publicRoom";

    const updatePlayersOnline = () => {
      socket.to(publicRoom).emit("updatePlayersOnline", users.length);
      console.log(users.length);
    };

    socket.on("connected", (username) => {
      socket.join(publicRoom);
      console.log(`${username} joined.`);
      // if (users.includes(username)) {
      //   username += "_dupe";
      //   socket.emit("changeUsername", username);
      // }
      socket.to(publicRoom).broadcast.emit("userJoined", username);
      users.push({ id: socket.id, username });
      updatePlayersOnline();
    });

    socket.on("disconnect", () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === socket.id) {
          socket.to(publicRoom).broadcast.emit("userLeft", users[i].username);
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
      socket.to(publicRoom).broadcast.emit("receiveMessage", msgInfo);
      //^ sends data to every user except user who sent the data
    });

    // io.emit("test", "welcome");
  } else if (socket.handshake.headers.referer.includes("/games")) {
    socket.on("connected", (data) => {
      console.log(`${data.username} joined the Games room.`);
      gamesUsersList.push({
        username: data.username,
        id: socket.id,
      });
    });
    socket.on("disconnect", () => {
      for (let i = 0; i < gamesUsersList.length; i++) {
        if (gamesUsersList[i].id === socket.id) {
          // socket.to(gamesRoom).broadcast.emit("userLeft", gamesUsersList[i].username);
          // gamesUsersList.filter(gamesUsersList[i].id === socket.id);
          console.log(`${gamesUsersList[i].username} left the Games room.`);
        }
      }
    });
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
