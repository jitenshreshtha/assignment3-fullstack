const User = require('../models/user');
const Appointment = require('../models/appointment');
const bcrypt = require('bcrypt');

module.exports.g2Post = async(req,res)=>{
    try{
        const {firstname, lastname, license, age, dob, cardetails, appointmentDate, appointmentTime} = req.body;

        const encryptedLicense = await bcrypt.hash(license,10);
        
        // Update user information
        const updatedUser = await User.findByIdAndUpdate(req.session.user_id, {
            firstname,
            lastname,
            license: encryptedLicense,
            age,
            dob,
            cardetails
        });

        console.log(appointmentDate,appointmentTime);
        // If appointment is selected, book it
        if (appointmentDate && appointmentTime) {
            const appointment = await Appointment.findOne({
                date: appointmentDate,
                time: appointmentTime,
                isTimeSlotAvailable: true
            });

            if (appointment) {
                appointment.isTimeSlotAvailable = false;
                appointment.userId = req.session.user_id;
                await appointment.save();

                // Update user with appointment reference
                updatedUser.appointmentId = appointment._id;
                await updatedUser.save();
            }
        }

        res.redirect('/g');
    }
    catch(err){
        console.log("error in g2post :", err);
        res.status(500).send("Error processing your request");
    }
}
