const express = require("express");
const cors = require("cors");

const routes = require("./routes");
require("./constants");
const emitter = require("./emitter");
require("dotenv").config({ path: "./.env" });

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.options("*", cors());
app.use(express.json());

require("./database");
require("./helpers/MatchOrder");

app.use("/api", routes);

io.on("connection", function (socket) {
  socket.on("initData", () => {
    emitter.emit("initData");
  });
  emitter.on("returnExchangeData", (param) => {
    const { stocksData, socketId } = param;
    if(socketId)
    io.to(socketId).emit("getStocks", stocksData);
    else
    socket.emit("getStocks",stocksData)
  });
  socket.on("subcribeExchange", function (param) {
    const { exchange, socketId } = param;
    console.log("subcribe " + exchange + socketId);
    global.exchange = exchange;
    emitter.emit("getExchangeData", { exchange: exchange, socketId: socketId });
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
