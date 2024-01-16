const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./router/user.router");
const { bookRouter } = require("./router/book.router");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/books", bookRouter)

app.get("/", (req, res) => {
    res.end("Welcome to LMS");
})

app.listen(process.env.PORT, async () => {
    try {
        const connection = await mongoose.connect(process.env.mongoURL)
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
})