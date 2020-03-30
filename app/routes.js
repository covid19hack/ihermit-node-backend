const express = require('express');
const usersController = require('./controllers/api/v1/users');
const checkInsController = require('./controllers/api/v1/checkIns');
const authHelper = require('./helpers/auth')

const router = express.Router();
const usersRouter = express.Router();
const checkInsRouter = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('/api/v1/users', usersRouter);
router.use('/api/v1/checkIns', checkInsRouter);

// users routes
usersRouter.post('/authenticate', usersController.authenticate);
usersRouter.patch('/updateNickName', authHelper.authenticate, usersController.updateNickName);
usersRouter.get('/profile', authHelper.authenticate, usersController.getProfile);
usersRouter.patch('/achievement', authHelper.authenticate, usersController.updateAchievement);
usersRouter.post('/checkIn', authHelper.authenticate, usersController.createCheckIn)

// checkin routes
checkInsRouter.patch('/:id', authHelper.authenticate, checkInsController.updateBreach);

module.exports = router
