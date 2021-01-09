const User = require("../models/user");

//get all users
exports.getAllUser = async (req, res, next) => {
    try {
            const users = await User.find();
            res.status(200).json({
                status: "Success to get all users by admin",
                data: users
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status: "Failed to get all users to admin",
        });
        console.log(ex);
        next();
    }
}

//get a user by id
exports.getUserById = async (req, res, next) => {
    try {
            const user = await User.findById(req.params.id);
            res.status(200).json({
                status: "Success to get all users by admin",
                data: user
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status: "Failed to get user by id to admin",
        });
        console.log(ex);
        next();
    }
}

//create user
exports.createUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.create(req.body);
            res.status(200).json({
                status: "created user successfully by admin",
                data: user
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status: "Failed to create user by admin",
        });
        console.log(ex);
        next();
    }
}


//update user

exports.updateUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators:true
            });
            res.status(200).json({
                status: "updated user successfully by admin",
                data: user
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status: "Failed to update user by admin",
        });
        console.log(ex);
        next();
    }
}

//delete user
exports.deleteUserByAdmin = async (req, res, next) => {
    try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: "deleted user successfully by admin",
            });
            next();
        next();
    } catch (ex) {
        res.status(400).json({
            status: "Failed to delete user by admin",
        });
        console.log(ex);
        next();
    }
}