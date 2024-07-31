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
    io.of(namespace.href).on("connection", (socket) => {
      socket.emit("rooms", namespace.rooms);
    });
  });
};