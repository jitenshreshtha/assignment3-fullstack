function validateUser(user) {
    if (!user.email || !user.password) {
        throw new Error('Email and password are required');
    }
    return true;
}

module.exports = { validateUser };
