const isCreator = (req, res, next) => {
    if (req.body.roles.includes("CREATOR")) {
        next();
    }
    else {
        res.status(401).send({ "msg": "You are not authorized" })
    }
}
module.exports = { isCreator };