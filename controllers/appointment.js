const Appointment = require('../models/appointment');

const appointmentController = async (req, res) => {
    try {
        // Define time slots
        const timeSlots = [
            "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
        ];

        // Fetch all appointments for display
        const appointments = await Appointment.find({})
            .sort({ date: 1, time: 1 });

        // Get today's date in YYYY-MM-DD format for the date input's default value
        const today = new Date().toISOString().split('T')[0];

        res.render('pages/appointment', { 
            appointments,
            timeSlots,
            message: req.query.message,
            selectedDate: req.query.date || today
        });
    } catch (error) {
        res.render('pages/appointment', { 
            appointments: [],
            timeSlots: [],
            message: 'Error fetching appointments',
            selectedDate: new Date().toISOString().split('T')[0]
        });
    }
};

const createAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        
        // Check if appointment already exists
        const existingAppointment = await Appointment.findOne({ date, time });
        if (existingAppointment) {
            return res.redirect('/appointment?message=Time slot already exists');
        }

        // Create new appointment
        const appointment = new Appointment({
            date,
            time,
            isTimeSlotAvailable: true
        });
        
        await appointment.save();
        res.redirect('/appointment?message=Appointment slot created successfully');
    } catch (error) {
        res.redirect('/appointment?message=Error creating appointment');
    }
};

module.exports = {
    appointmentController,
    createAppointment
};