const express = require("express");
const app = express();
const connectdb = require("./config/db");
const dotenv = require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
// add more secure for app this library add more header to request
app.use(helmet());

// It is very important, as it determines who can benefit from this API, so if you put it empty, anyone can use it, but if you put the domain
// Example: I have an app for the front whose domain is http://localhost:3000. If I put it inside LaCross, this is the only domain that can benefit.
// app.use(cors({
//     origin: "http://localhost:3000"
// })); only exam

// third party middleware => type 1 middleware
app.use(cors());

// built in middleware =>type 2 middleware
app.use(express.json());
// connect db using this function
connectdb();
//static folder to read image in browser
app.use(express.static(path.join(__dirname, "images")));
const { notFound, errorHandler } = require("./middlewars/log");
// ejs render > The mvc must be written in this way in order for it to work with the app.
// The first place must be written view engine, while the second place must write the library used, and here we use ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// route render
app.use("/hussain/information/", require("./router/data"));
app.use("/books/details/", require("./router/example"));
app.use("/user/auth", require("./router/auth"));
app.use("/user", require("./router/user"));
app.use("/password", require("./router/forgot-password"));
app.use("/api/uploadimage", require("./router/upload"));

// custom middleware => type 3 middleware
app.use(notFound);
app.use(errorHandler);

// server port
const PORT = process.env.PORT_conect || 5000;
//app server using express
app.listen(PORT, () => console.log(`Hi Node js app in Port ${PORT}`));
