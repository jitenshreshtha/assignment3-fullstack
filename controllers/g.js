const User = require("../models/User");
const Appointment = require('../models/appointment');

module.exports.gController = async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        const today = new Date().toISOString().split('T')[0];

        // Fetch all appointments from the database
        const allAppointments = await Appointment.find().sort({ date: 1, time: 1 });

        // Create formatted appointments with consistent date representation
        const formattedAppointments = allAppointments.map(app => {
            // Create a new date object at midnight in the local timezone
            const localDate = new Date(app.date);
            localDate.setHours(localDate.getHours() + localDate.getTimezoneOffset() / 60);

            return {
                ...app._doc,
                displayDate: localDate.toISOString().split('T')[0]
            };
        });


        const appointments = await Appointment.find({
            date: { $gte: today },
            isTimeSlotAvailable: true
        }).sort({ date: 1, time: 1 });


        if (user) {
            res.render('pages/g', { user, appointments: formattedAppointments });
        } else {
            res.render('pages/g', { user: null, appointments: null });
        }
    } catch (err) {
        console.log("Error in gController:", err);
    }
};
