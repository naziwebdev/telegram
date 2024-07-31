const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const socketConnection = require("./utils/socketConnection");
const socketHandler = require("./socket.io/index");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected successfully");
  } catch (error) {
    console.log("connect to mongodb faild", error);
    process.exit(1);
  }
};

const startServer = () => {
  const port = process.env.PORT || 4001;
  const httpServer = http.createServer(app);
  const io = socketConnection(httpServer);
  socketHandler(io);
  httpServer.listen(port, () => {
    console.log(`Server running on  port ${port}`);
  });
};

const run = async () => {
  await connectToDB();
  startServer();
};

run();
