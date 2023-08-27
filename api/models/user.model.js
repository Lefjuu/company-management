// const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        unique: true,
        sparse: true,
    },
    username: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    list: {
        type: Array,
    },
    role: {
        type: String,
        enum: ['employee', 'support', 'admin', 'owner'],
        default: 'employee',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.role = 'employee';
    const baseUsername =
        this.name.split(' ')[0].charAt(0) + this.name.split(' ')[1];
    let username = baseUsername;
    let count = 1;

    while (true) {
        const usernameExists = await User.exists({ username: username });

        if (!usernameExists) {
            break;
        }

        count++;
        username = baseUsername + count;
    }

    this.username = username;

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
