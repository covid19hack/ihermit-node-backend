const express = require('express');
const usersController = require('./controllers/api/v1/users/users');
const authHelper = require('./helpers/auth')

const router = express.Router();
const usersRouter = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('/api/v1/users', usersRouter);
usersRouter.post('/authenticate', usersController.authenticate)
usersRouter.get('/achievements', authHelper.authenticate, usersController.achievements)

module.exports = router
