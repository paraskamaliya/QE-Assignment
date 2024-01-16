const jwt = require("jsonwebtoken");
const { ListModel } = require("../model/list.model")
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        const tkn = await ListModel.findOne({ token });
        if (!tkn) {
            jwt.verify(token, "user", (err, decoded) => {
                if (err) {
                    res.status(202).send({ err: err.message });
                } else {
                    req.body.username = decoded.username;
                    req.body.userId = decoded.userId;
                    req.body.roles = decoded.roles;
                    next();
                }
            });
        } else {
            res.status(201).send({ "msg": "Please Login" });
        }
    } else {
        res.status(400).send({ "message": "Please Login" });
    }
};

module.exports = { auth };