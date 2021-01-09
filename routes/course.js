const { getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require("../controllers/course");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { checkAuth } = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");


router.route("/").get(getCourses).post(checkAuth,roleBased('publisher','admin'),addCourse);
router.route("/:id").get(getCourse).put(checkAuth,roleBased('publisher','admin'),updateCourse).delete(checkAuth,roleBased("publisher","admin"),deleteCourse);


module.exports = router;