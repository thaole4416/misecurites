const mongoose = require("mongoose");
const DatabaseHelper = require("./helpers/database")


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



DatabaseHelper.seedData();


