const socketIo = require("socket.io");

module.exports = (httpServer) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  return io;
};
