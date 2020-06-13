const express = require("express");
const cors = require("cors");
const path=require('path');
const routes = require("./routes");
require("./constants");
const emitter = require("./emitter");
require("dotenv").config({ path: "./.env" });

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.SERVER_PORT
const TimeHelper = require("./helpers/time")
app.use(cors());
app.options("*", cors());
app.use(express.json());

require("./database");
require("./helpers/MatchOrder");
app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/api", routes);

global.phien = -1;
// TimeHelper.excuteCodeAtTime(()=>emitter.emit("initData"),{ hour: 9, minute: 0, second: 0, milisecond: 0 })
// emitter.emit("initData")
//khop dinh ky

io.on("connection", function (socket) {
  emitter.on("returnExchangeData", (stocksData) => {
    socket.emit("getStocks",stocksData)
  });
  emitter.on("returnExchangeDataOne", (stockData) => {
    socket.emit("getStock",stockData)
  });
  socket.on("getExchangeData", function () {
    emitter.emit("getExchangeData");
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
