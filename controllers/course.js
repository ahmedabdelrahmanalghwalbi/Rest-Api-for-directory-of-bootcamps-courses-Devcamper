const Course = require("../models/course");
const Bootcamp = require("../models/bootCamp");


// /courses
// /bootcamp/bootcampId/courses
exports.getCourses = async (req, res, next) => {
    try {
        let query;
        if (req.params.bootcampId) {
            query = Course.find({ bootcamp: req.params.bootcampId });
        } else {
            query = Course.find().populate('bootcamp');
        }
        const courses = await query;
        res.status(200).json({
            status: "get courses successfully",
            data: courses,
            count:courses.length,
        })
    } catch (ex) {
        res.status(400).json({
            status: "failed to load courses",
        });
        console.log(ex);
        next();
    }
}

//get course by id

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('bootcamp');
        if (!course) {
            res.status(400).json({
                status: `failed to get course with the id ${req.params.id}`,
            })
            return next();
        }
        res.status(200).json({
            status: "get course with the id successfully",
            data:course
        });
    } catch(ex) {
        res.status(400).json({
            status: "failed to get the course by id",
        });
        console.log(ex);
        next();
    }
}

//add course
//bootcamp/:bootcampId/courses
exports.addCourse = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if (!bootcamp) {
            res.status(400).json({
                status: `failed to get bootcamp with the id ${req.params.bootcampId}`,
            })
            return next();
        }  
        const course = await Course.create(req.body);
        res.status(200).json({
            status: "add course to the bootcamp the bootcampId successfully",
            data:course
        });
    } catch (ex) {
        res.status(400).json({
            status: "failed to get the bootcamp by id",
        });
        console.log(ex);
        next();
    }

}

//update course by using courseId
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            res.status(400).json({
                status: `failed to update course with the id ${req.params.id}`,
            })
            return next();
        }  
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "add course to the bootcamp the bootcampId successfully",
            data:course
        });
    } catch (ex) {
        res.status(400).json({
            status: "failed to update the course by id",
        });
        console.log(ex);
        next();
    }
}

//delete course
exports.deleteCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            res.status(400).json({
                status: `failed to delete the course ${req.params.id}`,
            })
            return next();
        } 
        await course.remove();
        res.status(200).json({
            status: "deleted course successfully",
        });
    } catch (ex) {
        res.status(400).json({
            status: "failed to update the course by id",
        });
        console.log(ex);
        next();
    }
}