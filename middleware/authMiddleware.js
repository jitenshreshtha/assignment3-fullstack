const authenticateDriver = (req, res, next) => {
    if (req.session.user_id && req.session.usertype === "Driver") {
        next();
    } else {
        res.redirect('/login');
    }
};

const authenticateAdmin = (req, res, next) => {
    if (req.session.user_id && req.session.usertype === "Admin") {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = { authenticateDriver, authenticateAdmin };
