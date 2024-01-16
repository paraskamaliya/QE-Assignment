const express = require("express");
const { BookModel } = require("../model/book.model");
const { auth } = require("../middlewares/auth.middleware");
const { isCreator } = require("../middlewares/isCreator.middleware");
const bookRouter = express.Router();

bookRouter.use(auth);

/**
 * @swagger
 * components:
 *  schemas:
 *      Books:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto generated id of book
 *              title:
 *                  type: string
 *                  description: The title of book
 *              cover:
 *                  type: string
 *                  description: The cover image of book
 *              description:
 *                  type: string
 *                  description: The description of book
 *              genre:
 *                  type: string
 *                  description: The genre of book
 *              author:
 *                  type: string
 *                  description: The author of book
 *              date:
 *                  type: string
 *                  description: The date of book posted
 *              username:
 *                  type: string
 *                  description: The username of user who have posted
 *              userId:
 *                  type: string
 *                  description: The user Id of user who have posted
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: All routes related to books
 */

/**
 * @swagger
 * /books/:
 *  get:
 *      summary: this will get all the books of related to user role
 *      tags: [Books]
 *      responses:
 *          200:
 *              description: The list of books
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: '#/components/schemas/Books'
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
 *                                  type: string
 *                                  description: the error message
 */
bookRouter.get("/", async (req, res) => {
    const { new: isNew, old: isOld } = req.query;
    try {
        let books;
        if (req.body.roles.includes("VIEW_ALL")) {
            books = await BookModel.find();
        } else if (req.body.roles.includes("VIEWER")) {
            const tenMinutesAgo = new Date();
            tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
            if (isNew) {
                books = await BookModel.find({ userId: req.body.userId, date: { $gte: tenMinutesAgo } }).sort({ date: 1 });
            } else if (isOld) {
                books = await BookModel.find({ userId: req.body.userId, date: { $lt: tenMinutesAgo } }).sort({ date: -1 });
            } else {
                books = await BookModel.find({ userId: req.body.userId });
            }
        }
        res.status(200).send(books);
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error.message })
    }
})

/**
 * @swagger
 * /books/
 *  post:
 *      summary: to add book data
 *      tags:[users]
 *      requestBody:
 *          required:true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: The title of book
 *                          description:
 *                              type: string
 *                              description: The description of book
 *                          genre:
 *                              type: string
 *                              description: The genre of book
 *                          author:
 *                              type: string
 *                              description: The author of book
 *                          cover:
 *                              type: string
 *                              description: The cover image of book
 *      responses:
 *          200:
 *              description: Book data is added
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: The message of result
 *                              bookData:
 *                                  type: object
 *                                  description: The book data which is posted
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

bookRouter.post("/", isCreator, async (req, res) => {
    const { title, description, cover, author, genre, username, userId } = req.body;
    try {
        const book = new BookModel({
            title,
            cover,
            description,
            author,
            genre,
            date: new Date(),
            username,
            userId
        })
        await book.save();
        res.status(200).send({ "msg": "New Book is Added", "bookData": book })
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

/**
* @swagger
* /books/delete/{id}:
*   delete:
*       summary: Remove the book by id
*       tags: [Books]
*       parameters:
*           - in: path
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The book id
*       responses:
*           200:
*               description: The user was deleted
*           404:
*               description: The user was not found
*/


bookRouter.delete("/delete/:id", isCreator, async (req, res) => {
    const { id } = req.params;
    try {
        await BookModel.findByIdAndDelete({ _id: id });
        res.status(200).send({ "msg": "Book is deleted" })
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

/**
* @swagger
* /books/update/{id}:
*   delete:
*       summary: update the books by id
*       tags: [Books]
*       parameters:
*           - in: path
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The book id
*       responses:
 *          200:
 *              description: Data is updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: the message of result
 *          400:
 *              description: Data is updated
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

bookRouter.patch("/update/:id", isCreator, async (req, res) => {
    const { id } = req.params;
    try {
        let update = await BookModel.findByIdAndUpdate({ _id: id }, req.body);
        res.status(200).send({ "msg": "Book is updated" })
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

module.exports = { bookRouter };