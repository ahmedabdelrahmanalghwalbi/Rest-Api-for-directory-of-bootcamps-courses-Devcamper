const express = require("express");
const router = express.Router({mergeParams:true});
const { getAllReviewsForBootcamp,getReviewById,createReviewInBootcamp,updateReview,deleteReview} = require("../controllers/review");
const { checkAuth } = require("../middlewares/check_auth");
const { roleBased } = require("../middlewares/role_based");


router.route('/').get(getAllReviewsForBootcamp).post(checkAuth,roleBased("user","admin"),createReviewInBootcamp);
router.route('/:id').get(getReviewById).put(checkAuth,roleBased("admin","user"),updateReview).delete(checkAuth,roleBased("admin","user"),deleteReview);

module.exports = router;