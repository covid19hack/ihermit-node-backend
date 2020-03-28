const express = require('express');
const usersRouter = require('./api/v1/users/users');

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('api/v1/users', usersRouter);

module.exports = router
