const User = require('../models/user');


module.exports.result = async (req, res) => {
    try {
        const driverId = req.session.user_id; 
        const driver = await User.findById(driverId);

        if (!driver) {
            return res.status(404).send("Driver not found");
        }
        res.render('pages/result', { driver });
    } catch (error) {
        console.error("Error retrieving driver details:", error);
        res.status(500).send("Error retrieving details. Please try again.");
    }
};