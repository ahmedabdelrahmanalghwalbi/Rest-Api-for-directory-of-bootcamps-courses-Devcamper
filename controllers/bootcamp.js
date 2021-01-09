const Bootcamp = require('../models/bootCamp');
const geocoder = require('../configs/geocoder');

//get all bootcamps
exports.getBootcamps = async (req, res, next) => {
    try{
    let query;
    let quertStr = JSON.stringify(req.query);
    quertStr = quertStr.replace(/\b(gt|gte|in|lt|lte)\b/g, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(quertStr)).populate('courses');
    const bootcamps = await query; 
            res.status(200).json({
                data: bootcamps,
                status: "success"
               });
         next();
    } catch (ex) {
        res.status(400).json({
            status: "fail with get all bootcamps"
        });
        next(ex);
        console.log("error with get all bootcamps")
    }
}

//create new bootcamp
exports.createBootcamp = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        //check for the role of the user if is not an admin then he can publish only one bootcamp
        const publishedBootcamp = await Bootcamp.findOne({ use: req.user.id });
        if (publishedBootcamp && req.user.role !== 'admin') {
            res.status(400).json({
                status: `the user with the ID ${req.user.id} has already published the bootcamp`,
                publishedBootcamp: publishedBootcamp,
            });
        }
        if (req.file) {
            req.body.bootcampImage = req.file.path;
        }
        const bootcamp = await Bootcamp.create(req.body);
            res.status(200).json({
            data: bootcamp,
            status: "success"
    }); 
    next();
    } catch (ex) {
         res.status(400).json({
            status: "fail with post new bootcamp"
        });
        next(ex);
        console.log("error with post new bootcamp");
    }
}

//get one bootcamp by it's id
exports.getBootcampById =async (req, res, next) => {
    try {
        const bootcampId = req.params.id;
        const bootcamp = await Bootcamp.findById(bootcampId);
        if (!bootcamp) {
            res.status(400).json({
                status:"the bootcamp that you need get is not exist"
            })
        }
        res.status(200).json({
            data: bootcamp,
            status: "success"
        });
        next();
    } catch (ex) {
        res.status(400).json({
            status: "failed with get bootcamp by id"
        });
        console.log("failed with get bootcamp by id");
        next(ex);
    }
}

//update a bootcamp by id
exports.updateBootCamp =async (req, res, next) => {
    try {
        const bootcampId = req.params.id;
        if (req.file) {
            req.body.bootcampImage = req.file.path;
            console.log(req.file);
        }
        const bootcamp = await Bootcamp.findOneAndUpdate(bootcampId, req.body, {
            new: true,
            runValidators:true,
        });
        if (!bootcamp) {
            res.status(400).json({
                status:"not fount the bootcamp that you want to update",
            })
        }
        res.status(200).json({
            data: bootcamp,
            status:"failed with update bootcamp by id",
        })
        next();
    } catch (ex) {
        res.status(400).json({
            status: "failed with update bootcamp by id",
        });
        console.log("failed with update bootcamp by id");
        next(ex);
    }
}

//delete bootcamp by id
exports.deleteBootcamp =async (req, res, next) => {
    try {
        const bootcampId = req.params.id;
        const bootcamp = await Bootcamp.findById(bootcampId);
        if (!bootcamp) {
            res.status(400).json({
                status: "failed to delete the bootcamp",
            });
        }
        bootcamp.remove();
        res.status(200).json({
            status: "that bootcamp deleted successfully",
        });
        next();
    } catch (ex) {
        res.status(400).json({
            status: "failed to delete the bootcamp",
        });
        next(ex),
            console.log("that bootcamp deleted successfully");
    }
}

//get bootcamps with radius
//get bootcamps that around you in your origin
//get bootcamps that i choose by enter the zipcode of my origin and the distance that i want
exports.getBootcampInRadius = async (req, res, next) => {
    try {
        //get zipcode and distance from query parameters
        const { zipcode, distance } = req.params;
        //get lang and lat from geocoder
        const loc = await geocoder(zipcode);
        const lng = loc[0].longitude;
        const lat = loc[0].latitude;
        //calc radius using earth radius by dividing distance by radius of the earth
        //earth radius =3,963 mi,6,378 km
        const radius = distance / 3963;
        const bootcamps = await Bootcamp.find({
            location: { $centerSphere: [[lng, lat], radius] },
        });
        res.status(200).json({
            status: "success get bootcamps with radius",
            data: bootcamps,
            count: bootcamps.length,
        });
    } catch (ex) {
        res.status(400).json({
            status: "failed get bootcamps with radius",
        });
        console.log(ex);
    }    
}