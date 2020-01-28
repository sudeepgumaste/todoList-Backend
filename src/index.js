import express from "express";
import dotenv from "dotenv";
import process from "process";
import { router } from "./router";
import mongoose from "mongoose";
import cors from "cors";

//configuring environment
dotenv.config();

//create express app
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  // console.log(req);
  res.send("<h1>It works</h1>");
});

//db connection
mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => {
    console.log("Connected to DB");
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
