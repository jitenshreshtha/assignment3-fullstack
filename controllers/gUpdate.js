const User = require('../models/user.js');

module.exports.gupdate = async(req,res) =>{
    const {license} = req.params;
    const {make,model,year,plate} = req.body;
    try{
        const user = await User.findOne({license:license});
        if(!user){
            return res.send('no user found');
        }
        user.cardetails.make = make;
        user.cardetails.model = model;
        user.cardetails.year = year;
        user.cardetails.plate = plate;

        const updateUser = await user.save();
        res.redirect('/g');
    }
    catch(err){
        console.log('error in update page',err);
    }
}