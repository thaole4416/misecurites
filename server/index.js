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
emitter.emit("initData");
io.on("connection", function (socket) {
  socket.on("initData", () => {
    emitter.emit("initData");
  });
  emitter.on("returnExchangeData", (stocksData) => {
    socket.emit("getStocks",stocksData)
  });
  socket.on("getExchangeData", function () {
    emitter.emit("getExchangeData");
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
