const User = require('../models/user.model');

exports.getUser = (id) => {
    const user = User.findById(id);
    return user;
};
