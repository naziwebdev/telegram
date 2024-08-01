const namespaceModel = require("../models/Chat");

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
        getMessage(socket);

        socket.on("disconnect", async () => {
          await getRoomOnlineUsers(io, mainNamespace.href, newRoom);
        });
      });
    });
  });
};

const getMessage = (socket) => {
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
  });
};

const getRoomOnlineUsers = async (io, href, roomName) => {
  const onlineUsers = await io.of(href).in(roomName).allSockets();

  io.of(href).in(roomName).emit("onlineUsers", Array.from(onlineUsers).length);
};
