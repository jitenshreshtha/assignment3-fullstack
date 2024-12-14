const User = require('../models/user');

const examiner = async (req, res) => {
    try {
        const testtype = req.query.testtype || "all";
        const query = { status: "pending", usertype: 'Driver' };

        if (testtype !== "all") {
            query.testtype = testtype;
        }


        // Fetch users with their associated appointments, sorted by appointmentDate
        const appointments = await User.find(query)
            .populate({
                path: 'appointmentId', // Assuming `appointmentId` is a reference to the `Appointment` model
                select: 'date time'
            })
            .sort({ 'appointmentId.date': 1 })
            .exec();
        
       
        res.render('pages/examiner', { appointments, testtype });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("An error occurred while fetching appointments.");
    }
};

const markDriver = async (req, res) => {
    const { driverId, isPassed, comment } = req.body;

    try {
        await User.findByIdAndUpdate(driverId, {
            isPassed,
            comment,
            status: isPassed ? "passed" : "failed"
        });
        res.redirect('/examiner');
    }
    catch (error) {
        console.log("Error updating driver status:", error);
        res.status(500).send("Error while updating driver status");
    }
}

module.exports = { examiner, markDriver };
