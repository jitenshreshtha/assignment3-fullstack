const User = require('../models/user.js');
const Appointment = require('../models/appointment.js');

module.exports.g2Controller = async(req,res) =>{
    try {
        const user = await User.findById(req.session.user_id);
        const today = new Date().toISOString().split('T')[0];
        const appointments = await Appointment.find({
            date: today,
            isTimeSlotAvailable: true
        });
        
        res.render('pages/g2', { 
            user,
            appointments
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.render('pages/g2', { 
            user: null,
            appointments: []
        });
    }
}
