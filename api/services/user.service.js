const User = require('../models/user.model');

exports.getUser = async (id) => {
    return await User.findById(id);
};
