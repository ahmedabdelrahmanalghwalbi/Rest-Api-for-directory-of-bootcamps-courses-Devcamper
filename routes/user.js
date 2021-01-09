const express = require("express");
const router = express.Router();
const { registerController, loginController, getMeController ,updateUserInfo} = require("../controllers/user");
const { checkAuth } = require("../middlewares/check_auth");

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', checkAuth, getMeController);
router.put('/update-user-information', updateUserInfo);

module.exports = router;