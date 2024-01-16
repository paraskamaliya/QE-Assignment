const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { ListModel } = require("../model/list.model");
const { auth } = require("../middlewares/auth.middleware");

userRouter.post("/register", async (req, res) => {
    let { username, email, password } = req.body;
    let user = await UserModel.findOne({ email })
    try {
        if (user) {
            res.status(201).send({ "message": "User is already present, Please use another Email" })
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (hash) {
                    const user = new UserModel({
                        username, email, password: hash, roles: ["VIEW_ALL"]
                    })
                    await user.save()
                    res.status(200).send({ "message": "User is registered" })
                }
                else {
                    res.status(202).send({ "message": "Something went wrong.", "err": err })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    try {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username: user.username, userId: user._id }, "user", { expiresIn: "1h" });
                    res.status(200).send({ "message": "Successfully login", "token": token, "user": user })
                }
                else {
                    res.status(201).send({ "message": "Something went wrong", "err": err })
                }
            })
        }
        else {
            res.status(202).send({ "message": "User is not Registered, please register" })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        const newToken = new ListModel({ token })
        await newToken.save();
        res.status(200).send({ "message": "Logout Successful" })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

module.exports = { userRouter };