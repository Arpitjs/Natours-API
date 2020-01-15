let crypto = require('crypto')
let mongoose = require('mongoose')
let validator = require('validator')
let bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: ['20', 'A user cannot have more than 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is of invalid format')
            }
        }
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password
            }
        },
        message: 'the passwords do not match.'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre('/^find/', function (next) {
    // this points to current query.
    // dont know why this query is not running. hmm.
    this.find({ active: { $ne: false } })
    next()
})

userSchema.methods.correctPassword = async function (p1, p2) {
    return await bcrypt.compare(p1, p2)
}

//methods are accessible to the instances. so this referes to instance 'user'.
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        let changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return jwtTimestamp < changedTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    let resetToken = crypto.randomBytes(32).toString('hex') //the one thats being sent through email and on params.
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex') //hashed one //stored in db
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

let userModel = mongoose.model('User', userSchema)

module.exports = userModel