const express = require("express");
const router = express.Router();
const updateUser = require("../models/users");

const _UsObj = new updateUser();

router.post("/", function (req, res, next) {
  const userData = req.body;
  _UsObj.createUser(userData, function (callback) {
    res.send(callback);
  });
});

module.exports = router;
