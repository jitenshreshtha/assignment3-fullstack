const Appointment = require('../models/appointment');

const appointmentController = async (req, res) => {
    try {
        const timeSlots = [
            "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
        ];

        const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

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

        // Filter appointments based on selected date
        const selectedDateAppointments = allAppointments.filter(
            appointment => {
                const appointmentDate = new Date(appointment.date);
                appointmentDate.setHours(0, 0, 0, 0);
                const formattedAppointmentDate = appointmentDate.toISOString().split('T')[0];
                return formattedAppointmentDate === selectedDate;
            }
        );

        // Create a map of booked times for the selected date
        const bookedTimes = new Set(selectedDateAppointments.map(app => app.time));

        // Create time slots with availability status for the selected date
        const timeSlotsWithAvailability = timeSlots.map(time => ({
            time,
            isAvailable: !bookedTimes.has(time),
        }));

        // Render the appointment page
        res.render('pages/appointment', { 
            allAppointments: formattedAppointments,
            timeSlots: timeSlotsWithAvailability,
            message: req.query.message,
            selectedDate
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.render('pages/appointment', { 
            allAppointments: [],
            timeSlots: [],
            message: 'Error fetching appointments',
            selectedDate: new Date().toISOString().split('T')[0]
        });
    }
};








const createAppointment = async (req, res) => {
    try {
        let date = req.body.date;
        const time = req.body.time;

      

        // Convert the date to a Date object using local timezone
        const localDate = new Date(date);
        
        // Check if the date is valid
        if (isNaN(localDate.getTime())) {
            return res.redirect('/appointment?message=Invalid date format');
        }

        // Convert to UTC
        const utcDate = new Date(Date.UTC(
            localDate.getFullYear(), 
            localDate.getMonth(), 
            localDate.getDate()
        ));

        // Check if the appointment already exists for this date and time
        const existingAppointment = await Appointment.findOne({ 
            date, 
            time 
        });

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
        console.error('Error creating appointment:', error);
        res.redirect('/appointment?message=Error creating appointment');
    }
};

module.exports = {
    appointmentController,
    createAppointment
};