const Review = require("../models/review");
const Bootcamp = require("../models/bootCamp");
const review = require("../models/review");
//get all reviews from the bootcamp
//bootcamp/:bootcampId/reviews
exports.getAllReviewsForBootcamp = async (req, res, next) => {
    try {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId }).populate({
            path: "bootcamp",
            select:"name description"
        });
        res.status(200).json({
            status: "get reviews Successfully",
            data:reviews
        });
    } catch (ex) {
        res.status(400).send("error with getting the reviews of the bootcamp")
        console.log(ex);
        next();
    }
}

//get review by it is Id
exports.getReviewById = async (req, res, next) => {
    try {
        const review = await Review.find({ bootcamp: req.params.id }).populate({
            path: "bootcamp",
            select:"name description"
        });
        res.status(200).json({
            status: "get reviews Successfully",
            data:review
        });
        if (!review) {
            res.status(400).send(`not review found for this id ${req.params.id}`)
        }
    } catch (ex) {
        res.status(400).send("error with getting the review by id")
        console.log(ex);
        next();
    }
}

//create new review in a bootcamp
//bootcamp/:bootcampId/review

exports.createReviewInBootcamp = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        if (!bootcamp) {
            res.status(400).send(`not found bootcamp with the id ${req.params.bootcampId}`);
            next();
        }
        const review = await Review.create(req.body);
        res.status(200).json({
            status: "get reviews Successfully",
            data:review
        });
    } catch (ex) {
        res.status(400).send("error with getting the reviews of the bootcamp")
        console.log(ex);
        next();
    }
}

exports.updateReview = async (req, res, next) => {
    try {
        let checkReview = await Review.findById(req.params.id);
        if (!checkReview) {
            res.status(400).send(`not found review with the id ${req.params.id}`);
            next();
        }
        //make sure that user is not an admin
        if (checkReview.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(400).send("not authorized to update review");
        }
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "update review Successfully",
            data:review
        });
    } catch (ex) {
        res.status(400).send("error with updating the review")
        console.log(ex);
        next();
    }
}
exports.deleteReview = async (req, res, next) => {
        try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(400).send(`not found review with the id ${req.params.id}`);
            next();
        }
        //make sure that user is not an admin
        if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(400).send("not authorized to delete review");
        }
            await review.remove();
        res.status(200).json({
            status: "delete review Successfully",
            data:review
        });
    } catch (ex) {
        res.status(400).send("error with deleting the review")
        console.log(ex);
        next();
    }
}