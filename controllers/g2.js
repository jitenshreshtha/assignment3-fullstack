const User = require('../models/User.js');
const Appointment = require('../models/appointment.js');

module.exports.g2Controller = async (req, res) => {
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

        res.render('pages/g2', {
            user,
            appointments: formattedAppointments
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.render('pages/g2', {
            user: null,
            appointments: []
        });
    }
}