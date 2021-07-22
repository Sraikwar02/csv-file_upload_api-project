const express = require('express');
const feedController = require('../controllers/feed');
const router = express.Router();
const upload = require("../middleware/upload");
const isAuth = require("../middleware/isAuth");

router.post('/login',feedController.login);

router.post('/upload',isAuth,upload.single("file"),feedController.upload);

router.get("/findAllUser",isAuth, feedController.getAllUser);

router.get("/findSingleUser",isAuth, feedController.getSingleUser);

router.post("/createUser",isAuth, feedController.createUser);

router.post("/updateUser",isAuth, feedController.updateUser);

router.delete("/deleteUser",isAuth, feedController.deleteUser);

module.exports = router;
