const express = require('express');
const usersController = require('./controllers/api/v1/users/users');
const authHelper = require('./helpers/auth')

const router = express.Router();
const usersRouter = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('/api/v1/users', usersRouter);

// users router
usersRouter.post('/authenticate', usersController.authenticate)
usersRouter.patch('/updateNickName', authHelper.authenticate, usersController.updateNickName)
usersRouter.post('/createCheckIn', authHelper.authenticate, usersController.createCheckIn)
usersRouter.get('/profile', authHelper.authenticate, usersController.getProfile)

module.exports = router
