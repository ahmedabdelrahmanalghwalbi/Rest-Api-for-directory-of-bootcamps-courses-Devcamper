//to determinds witch user is a normal user or publishers or admin

exports.roleBased = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role)) {
            res.starus(401).send(`access denied becouse the user role id ${req.user.role}`);
        }
        next();
    }
}