require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Middle wares imports 
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var cors = require('cors')

const authRoutes = require("./routes/auth")

//My Routes
const url = process.env.DATABASE;

//DB CONNECTION
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

//Middle wares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use("/api",authRoutes)
const PORT = process.env.PORT || 5000;

//Running a Server
app.listen(PORT, () => {
  console.log(`Server is Up and Running at ${PORT}`);
});
