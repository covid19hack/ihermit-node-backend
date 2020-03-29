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
usersRouter.post('/updateAchievement', authHelper.authenticate, usersController.updateAchievement);
usersRouter.post('/createCheckIn', authHelper.authenticate, usersController.createCheckIn)

// checkin routes
checkInsRouter.patch('/:id/dismissBreach', authHelper.authenticate, checkInsController.dismissBreach);

module.exports = router
