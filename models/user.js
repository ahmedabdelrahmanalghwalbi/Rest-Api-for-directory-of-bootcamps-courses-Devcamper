const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Please Enter a valid E-mail"],
        required: [true, "Please Enter Email"],
        unique:[true,"this E-mail is reserved by another user"],
    },
    role: {
        type: String,
        enum: ["user", "publisher"],
        default:"user"
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Please Enter the Password"],
        select:false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    }
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getSignedJwtToken = function () {
    const token = Jwt.sign({
        _id: this._id,
    },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIE,
        }
    );
    return token;
}

userSchema.methods.matchPasswords = async function (userPassword) {
    const validUserPassword = await bcrypt.compare(userPassword, this.password);
    return validUserPassword;
}

module.exports = mongoose.model('User', userSchema);