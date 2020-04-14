const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const sanGiaoDichRoute = require("./routes/sanGiaoDich.route");

require('dotenv').config({path: './.env'})

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connection etablished successfully")
);

app.use("/api/sanGiaoDich", sanGiaoDichRoute);


app.listen(port, () => console.log(`Server is running on port ${port}`));
