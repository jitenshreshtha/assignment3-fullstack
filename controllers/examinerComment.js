const User = require('../models/user');

module.exports.examinerComment = async (req, res) => {
    const { driverId, comment, isPassed } = req.body;

    try {
        const driver = await User.findById(driverId);
        driver.comment = comment;
        driver.isPassed = isPassed === "true";
        await driver.save();

        res.redirect('/examiner');
    } catch (error) {
        res.send("Error updating comment. Please try again.");
    }


    console.log('form submitted successfully');
};