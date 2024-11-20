const User = require("../models/user");

module.exports.gController = async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        if (user) {
            res.render('pages/g', { user });
        } else {
            res.render('pages/g', { user: null });
        }
    } catch (err) {
        console.log("Error in gController:", err);
    }
};
