const express = require("express");
const { BookModel } = require("../model/book.model");
const { auth } = require("../middlewares/auth.middleware");
const { isCreator } = require("../middlewares/isCreator.middleware");
const bookRouter = express.Router();

bookRouter.use(auth)

bookRouter.get("/", async (req, res) => {
    const { new: isNew, old: isOld } = req.query;
    try {
        let books;
        if (isNew) {
            const tenMinutesAgo = new Date();
            tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
            books = await BookModel.find({ date: { $gt: tenMinutesAgo } }).sort({ date: 1 });
        } else if (isOld) {
            const tenMinutesAgo = new Date();
            tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
            books = await BookModel.find({ date: { $lte: tenMinutesAgo } }).sort({ date: -1 });
        } else {
            books = await BookModel.find();
        }
        if (req.body.roles.includes("VIEWER")) {
            let updated = books.filter((el) => {
                return el.username == req.body.username
            })
            books = updated;
        }
        res.status(200).send(books);
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

bookRouter.post("/", isCreator, async (req, res) => {
    const { title, description, author, genre, username, userId } = req.body;
    try {
        const book = new BookModel({
            title,
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

bookRouter.delete("/delete/:id", isCreator, async (req, res) => {
    const { id } = req.params;
    try {
        await BookModel.findByIdAndDelete({ _id: id });
        res.status(200).send({ "msg": "Book is deleted" })
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

bookRouter.patch("/update/:id", isCreator, async (req, res) => {
    const { id } = req.params;
    try {
        let update = await BookModel.findByIdAndDelete({ _id: id }, req.body);
        res.status(200).send({ "msg": "Book is updated", "updatedBook": update })
    } catch (error) {
        res.status(400).send({ "msg": "Something went wrong,Please try again", "err": error })
    }
})

module.exports = { bookRouter };