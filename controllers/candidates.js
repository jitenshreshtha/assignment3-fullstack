const User = require('../models/user');

module.exports.candidateController = async (req,res) =>{
    try {
        const candidates = await User.find({ usertype:"Driver"}); 
        res.render('pages/candidates', { candidates });
      } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).send('Internal Server Error');
      }
}