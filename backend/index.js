const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require('morgan');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path')
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const { userRouter } = require("./routes/user.router");
const { bookRouter } = require("./routes/book.router");
const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

const options = {
    definition: {
        openai: "3.0.0",
        info: {
            title: "LMS Api",
            version: "1.0.0"
        },
        servers: [
            {
                "url": "https://lms-gr4j.onrender.com"
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerjsdoc(options);

app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/books", bookRouter);

app.listen(process.env.PORT, async () => {
    try {
        const connection = await mongoose.connect(process.env.mongoURL)
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
});
