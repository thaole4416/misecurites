const express = require("express");
const cors = require("cors");

const routes = require("./routes");
require("./constants")
const emitter = require("./emitter");
require("dotenv").config({ path: "./.env" });

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.options("*", cors());
app.use(express.json());

require("./database")

app.use("/api", routes);

io.on("connection", (socket) => {
  socket.on("initData", () => {
    emitter.emit("initData");
  });
  emitter.on("returnExchangeData", (data) => { socket.emit("getStocks",  data)});
  socket.on("subcribeExchange", function (exchange) {
    console.log("subcribe " + exchange);
    global.exchange = exchange;
    emitter.emit("getExchangeData");
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
