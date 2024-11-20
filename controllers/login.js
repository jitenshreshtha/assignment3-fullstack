module.exports.loginController = async(req,res) =>{
    try {
        res.render('pages/login');
    } catch(err) {
        console.error('Login error:', err);
        res.status(500).send('Error loading login page');
    }
}