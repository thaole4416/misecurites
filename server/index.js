const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");



require("dotenv").config({ path: "./.env" });

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.options('*', cors());
app.use(cookieParser("huhon"));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connection etablished successfully")
);

app.use("/api", routes);

io.on("connection", socket => {
  socket.on('sayHello',() => console.log("Hello!!"))
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
