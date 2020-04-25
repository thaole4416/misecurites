const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth.middleware");
const emitter = require('./emitter')
// const sanGiaoDichRoute = require("./routes/sanGiaoDich.route");
// const taiKhoanRoute = require("./routes/taiKhoan.route");
const routes = require("./routes");

require("dotenv").config({ path: "./.env" });

const app = express();

const port = process.env.SERVER_PORT || 5000;
app.use(cors());
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

// app.use("/api/sanGiaoDich/", authMiddleware.requireAuth,sanGiaoDichRoute);
// app.use("/api/taiKhoan",taiKhoanRoute);
app.use("/api", routes);
app.listen(port, () => console.log(`Server is running on port ${port}`));
