const express = require('express');
const router = express.Router();
const courseRouter = require("./course");
const reviewRouter = require("./review");
const { getBootcamps,createBootcamp,getBootcampById,updateBootCamp,deleteBootcamp,getBootcampInRadius } = require('../controllers/bootcamp');
const { checkAuth } = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `bootcamp-${file.originalname}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("not an Image", false);
    }
};
const upload = multer({
    storage: multerStorage,
    multerFilter: multerFilter,
})

//re-route into other resources route
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);
router.route('/').get(getBootcamps).post(checkAuth,roleBased("publisher","admin"),upload.single('bootcampImage'),createBootcamp);
router.route('/:id').get(getBootcampById).put(checkAuth,roleBased("publisher","admin"),upload.single('bootcampImage'),updateBootCamp).delete(checkAuth,roleBased("publisher","admin"),deleteBootcamp);
router.route('radius/:zipcode/:distance').get(getBootcampInRadius);
module.exports = router;