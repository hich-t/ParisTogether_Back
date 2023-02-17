const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const userRouter = require("./Backend/Routes/authRouter");
const eventRouter = require("./Backend/Routes/eventRouter");
const dateForEventRouter = require("./Backend/Routes/dateForEventRouteur");
const commentRouter = require("./Backend/Routes/commentRouter");

const cors = require("cors");
app.use("/public/images", express.static(path.join(__dirname, "/public/images")));
app.get("/public/images/:filename", (req, res) => {
  const file = `public/images/${req.params.filename}`;
  res.sendFile(path.resolve(file));
});
app.use(cors());
app.use("/request", userRouter, eventRouter, dateForEventRouter, commentRouter);

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error :"));

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
