const { initConnection, getNamespacesRoom } = require("./namespaces.socket");

module.exports = socketHandler = (io) => {
  initConnection(io);
getNamespacesRoom(io);
};
