const express = require("express");
const app = express();

const mongoose = require("mongoose");
const env = require("dotenv");
env.config();
app.use(express.json());

const { log, notFound, errorHandler } = require("./middlewars/log");
// Connect to the database
mongoose
  .connect(process.env.DATABASE_CONNECT, {})
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.error("Connection to MongoDB failed:", error);
  });

// using middlewars before rout and exam rout if i dont using next in middlewars the The rest of the route not working
app.use(log);
const route = require("./router/data");
const exam = require("./router/example");
const userss = require("./router/auth");
const edit = require("./router/user");

app.use("/hussain/information/", route);
app.use("/books/details/", exam);
app.use("/user/auth", userss);
app.use("/user", edit);

app.use(notFound);
app.use(errorHandler);

// server port
const PORT = process.env.PORT_conect || 5000;
//app server using express
app.listen(PORT, () => console.log(`Hi Node js app in Port ${PORT}`));
