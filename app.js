const express = require("express");
const app = express();
const connectdb = require("./config/db");
const env = require("dotenv").config();
app.use(express.json());
// connect db using this function
connectdb();

const { notFound, errorHandler } = require("./middlewars/log");

app.use("/hussain/information/", require("./router/data"));
app.use("/books/details/", require("./router/example"));
app.use("/user/auth", require("./router/auth"));
app.use("/user", require("./router/user"));

app.use(notFound);
app.use(errorHandler);

// server port
const PORT = process.env.PORT_conect || 5000;
//app server using express
app.listen(PORT, () => console.log(`Hi Node js app in Port ${PORT}`));
