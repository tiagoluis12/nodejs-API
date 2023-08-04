const express = require("express");
const { userRouter } = require("./routes/userRoutes");
const app = express();
const axios = require("axios");
require("dotenv").config();

console.log(process.env.NODE_API_KEY);

app.use(express.json());
app.use(userRouter);

app.listen(3000);
