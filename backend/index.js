const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require('morgan');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path')
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const { userRouter } = require("./router/user.router");
const { bookRouter } = require("./router/book.router");

const options = {
    definition: {
        openai: "3.0.0",
        info: {
            title: "Swagger Demo",
            version: "1.0.0"
        },
        servers: [
            {
                "url": "http://localhost:5000"
            }
        ]
    },
    apis: ["./router/*.js"]
}
const swaggerSpec = swaggerjsdoc(options);

app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/books", bookRouter)

const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

app.listen(process.env.PORT, async () => {
    try {
        const connection = await mongoose.connect(process.env.mongoURL)
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
})