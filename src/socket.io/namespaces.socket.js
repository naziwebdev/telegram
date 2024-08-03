const namespaceModel = require("../models/Chat");
const userModel = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.initConnection = (io) => {
  io.on("connection", async (socket) => {
    const namespaces = await namespaceModel.find({}).lean();

    socket.emit("namespaces", namespaces);
  });
};

exports.getNamespacesRoom = async (io) => {
  const namespaces = await namespaceModel.find({}).lean();

  namespaces.forEach((namespace) => {
    io.of(namespace.href).on("connection", async (socket) => {
      const mainNamespace = await namespaceModel.findOne({
        _id: namespace._id,
      });
      socket.emit("rooms", mainNamespace.rooms);

      getMessage(io, socket);
      getLocation(io, socket);
      getMedia(io, socket);

      socket.on("joining", async (newRoom) => {
        const lastRoom = Array.from(socket.rooms)[1];

        if (lastRoom) {
          socket.leave(lastRoom);
          await getRoomOnlineUsers(io, mainNamespace.href, lastRoom);
        }

        socket.join(newRoom);
        await getRoomOnlineUsers(io, mainNamespace.href, newRoom);

        const roomInfo = mainNamespace.rooms.find(
          (room) => room.title === newRoom
        );
        socket.emit("roomInfo", roomInfo);

        socket.on("disconnect", async () => {
          await getRoomOnlineUsers(io, mainNamespace.href, newRoom);
        });
      });
    });
  });
};

const getMessage = (io, socket) => {
  socket.on("newMsg", async (data) => {
    const { message, roomName, userID } = data;

    const namespace = await namespaceModel.findOne({ "rooms.title": roomName });

    await namespaceModel.updateOne(
      { _id: namespace._id, "rooms.title": roomName },
      {
        $push: {
          "rooms.$.message": {
            sender: userID,
            message,
          },
        },
      }
    );

    io.of(namespace.href).in(roomName).emit("confirmMsg", data);
  });
  detectIsTyping(io, socket);
};

const detectIsTyping = (io, socket) => {
  socket.on("isTyping", async (data) => {
    const { userID, roomName, isTyping } = data;

    const namespace = await namespaceModel.findOne({ "rooms.title": roomName });
    const user = await userModel.findOne({ _id: userID });
    io.of(namespace.href).in(roomName).emit("isTyping", {
      isTyping,
      user: user.username,
    });
    if (!isTyping) {
      await getRoomOnlineUsers(io, namespace.href, roomName);
    }
  });
};

const getLocation = (io, socket) => {
  socket.on("newLocation", async (data) => {
    const { location, sender, roomName } = data;

    const namespace = await namespaceModel.findOne({ "rooms.title": roomName });

    await namespaceModel.updateOne(
      {
        _id: namespace._id,
        "rooms.title": roomName,
      },
      {
        $push: {
          "rooms.$.locations": {
            x: location.x,
            y: location.y,
            sender,
          },
        },
      }
    );

    io.of(namespace.href).in(roomName).emit("confirmLocation", data);
  });
};

const getMedia = (io, socket) => {
  socket.on("newMedia", async (data) => {
    const { filename, sender, file, roomName } = data;

    const namespace = await namespaceModel.findOne({ "rooms.title": roomName });

    const ext = path.extname(filename);
    const uniqueFile = Date.now() * Math.floor(Math.random() * 99999);

    const pathFile = `medias/${String(uniqueFile + ext)}`;

    fs.writeFile(`public/${pathFile}`, file, async (err) => {
      if (!err) {
        await namespaceModel.updateOne(
          {
            _id: namespace._id,
            "rooms.title": roomName,
          },
          {
            $push: {
              "rooms.$.medias": {
                path:pathFile,
                sender,
              },
            },
          }
        );
      }

      io.of(namespace.href).in(roomName).emit("confirmMedia", data);
    });
  });
};

const getRoomOnlineUsers = async (io, href, roomName) => {
  const onlineUsers = await io.of(href).in(roomName).allSockets();

  io.of(href).in(roomName).emit("onlineUsers", Array.from(onlineUsers).length);
};
