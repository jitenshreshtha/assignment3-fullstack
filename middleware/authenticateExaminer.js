const authenticateExaminer = (req, res, next) => {
    if (req.session.usertype === 'Examiner') {
        next();
    }
    else {
        res.status(403).send("Access denied. Examiner role required");
    }
}

module.exports = { authenticateExaminer };