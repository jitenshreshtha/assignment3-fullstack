const User = require('../models/user');
const Appointment = require('../models/appointment');

module.exports.gPost = async (req, res) => {
    try {
        const { appointmentDate, appointmentTime, testtype } = req.body; // Destructure the testtype


        // Update user information
        const updatedUser = await User.findByIdAndUpdate(req.session.user_id, {
            testtype
        });

        // If appointment is selected, book it
        if (appointmentDate && appointmentTime) {
            const appointment = await Appointment.findOne({
                date: appointmentDate,
                time: appointmentTime,
                isTimeSlotAvailable: true
            });

            if (appointment) {
                appointment.isTimeSlotAvailable = false; // Mark the time slot as booked
                appointment.userId = req.session.user_id; // Assign the user to the appointment
                await appointment.save();

                // Update user with appointment reference
                updatedUser.appointmentId = appointment._id;
                await updatedUser.save();


                res.redirect('/g'); // Redirect to a success page or back to the G page
            } else {
                res.redirect('/g'); // Redirect back if appointment is not available
            }
        } else {
            res.redirect('/g'); // Redirect back if no appointment is selected
        }
    } catch (err) {
        console.log("Error in gPost:", err);
        res.redirect('/g'); // Redirect back on error
    }
};