const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { ListModel } = require("../model/list.model");

/**
 * @swagger
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: The username of user
 *              email:
 *                  type: string
 *                  description: The email of user
 *              password:
 *                  type: string
 *                  description: The password of user
 *              roles:
 *                  type: array
 *                  description: Contains the roles of user
 */

/**
 * @swagger
 * tags:
 *  name: users
 *  description: All user related Api routes
 */

/**
 * @swagger
 * /users/register
 *  post:
 *      summary: To post user data
 *      tags:[users]
 *      requestBody:
 *          required:true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Users'
 *      responses:
 *          200:
 *              description: user is registered and user data will be posted to database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *          201:
 *              description: userdata is already present
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *          202:
 *              description: some error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *                              err:
 *                                  type: object
 *                                  description: the error object
 *          400:
 *              description: some error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *                              err:
 *                                  type: object
 *                                  description: the error object
 */

userRouter.post("/register", async (req, res) => {
    let { username, email, password, roles } = req.body;
    let user = await UserModel.findOne({ email })
    try {
        if (user) {
            res.status(201).send({ "message": "User is already present, Please use another Email" })
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (hash) {
                    const user = new UserModel({
                        username, email, password: hash, roles: roles
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

/**
 * @swagger
 * /users/login
 *  post:
 *      summary: to login using email and password
 *      tags:[users]
 *      requestBody:
 *          required:true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: the email of user
 *                          password:
 *                              type: string
 *                              description: the password of user
 *      responses:
 *          200:
 *              description: user is registered and user data will be posted to database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: the message of result
 *                              token:
 *                                  type: string
 *                                  description: the generated token for user
 *                              user:
 *                                  type: object
 *                                  description: the user data
 *                              
 *          201:
 *              description: userdata is already present
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *                              err:
 *                                  type: object
 *                                  description: the error object
 *          202:
 *              description: some error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *          400:
 *              description: some error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *                              err:
 *                                  type: object
 *                                  description: the error object
 */
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    try {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ username: user.username, userId: user._id, roles: user.roles }, "user", { expiresIn: "1h" });
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

/**
 * @swagger
 * /users/logout:
 *  get:
 *      summary: for logging out
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: logout successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: the message for logout successfull
 *          400:
 *              description: some error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *                              err:
 *                                  type: object
 *                                  description: the error object
 */
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