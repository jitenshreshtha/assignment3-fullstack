const User = require('../models/User');

const examiner = async (req, res) => {
    try {
        const testtype = req.query.testtype || "all";
        const query = { status: "pending" };

        if (testtype !== "all") {
            query.testtype = testtype; 
        }

        // Fetch appointments sorted by appointmentDate
        const appointments = await User.find(query, 'firstname lastname testtype appointmentDate cardetails').sort({ appointmentDate: 1 });

        res.render('pages/examiner', { appointments, testtype });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send("An error occurred while fetching appointments.");
    }
};

module.exports = { examiner };
