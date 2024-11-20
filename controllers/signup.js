const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.signup = async(req,res)=>{
    const { username, password, confirmpassword, usertype } = req.body;
    try {

        if (password !== confirmpassword) {
            return res.send("Passwords do not match.");
        }
        // Check for duplicate usernames
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.send("Username is already taken.");
        }
    
        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
          username,
          password: encryptedPassword,
          usertype,
          firstname: "default",
          lastname: "default",
          license: "default",
          age: 0,
          cardetails: {
            make: "default",
            model: "default",
            year: 0,
            plate: "default",
          },
        });
    
        await newUser.save();
        res.redirect("/login");
      } catch (error) {
        res.send("Error creating user. Please try again.");
        console.log(error);
      }
}