const User = require('../models/user');

const listCandidates = async (req, res) => {
    try {
        const candidates = await User.find({}, 'firstname lastname isPassed comment');
        res.render('pages/admin', { candidates });
    }
    catch (error) {
        console.log("Error fetching candidates", error);
        res.status(500).send("error occurred while fetching candidates");
    }
}

module.exports = { listCandidates };