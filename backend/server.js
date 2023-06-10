const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const DbConnect = require("./database");
const PORT = process.env.PORT || 3000;
const router = require("./routes");
const cookieParser = require("cookie-parser");
const server = require("http").createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL;

// ==============================================
const allowList = FRONTEND_URL.split(",");
const ACTIONS = require("./actions.js");
const io = require("socket.io")(server, {
  cors: {
    origin: allowList,
    methods: ["GET", "POST"],
  },
});
// ====================================
const corsOption = {
  credentials: true,
  origin: function (origin, callback) {
    // Log and check yourself if the origin actually matches what you've defined in the allowList array
    // console.log(allowList, origin, allowList.indexOf(origin));
    if (allowList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// ====================================
app.use("/storage", express.static("storage"));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json({ limit: "5mb" }));
app.use(router);

// ================================================
// sockets
const socketUserMapping = {};

io.on("connection", (socket) => {
  // console.log("new connection", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // console.log(roomId, user);
    socketUserMapping[socket.id] = user;

    // ex: new Map() to convert array
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    // console.log(clients);

    clients.forEach((clientId) => {
      // clientId - client socket id
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });
    // console.log(socketUserMapping);
    socket.join(roomId);
  });

  // handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // handle relay sdp (session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });
  // =====================================================
  // handle mute and unmute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });
  // ====================================================
  // leaving the room
  const leaveRoom = ({ roomId }) => {
    // console.log(roomId);
    const { rooms } = socket;
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id,
        });
      });

      socket.leave(roomId);
    });
    delete socketUserMapping[socket.id];
  };
  socket.on(ACTIONS.LEAVE, leaveRoom);

  // handle leaveRoom after closing browser or tab
  socket.on("disconnecting", leaveRoom);
});

// ===================================================

async function ConnectServerAndDB() {
  try {
    await DbConnect();
    server.listen(PORT, () => console.log(`Server Started on port - ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}
ConnectServerAndDB();
