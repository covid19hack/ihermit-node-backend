const express = require('express');
const usersController = require('./controllers/api/v1/users/users');
const achievementsController = require('./controllers/api/v1/achievements/achievements');
const authHelper = require('./helpers/auth')

const router = express.Router();
const usersRouter = express.Router();
const achievementsRouter = express.Router();

router.get('/ping', (req, res) => {
  res.json({"message": "pong"});
})

router.use('/api/v1/users', usersRouter);
router.use('/api/v1/achievements', achievementsRouter);

// users routes
usersRouter.post('/authenticate', usersController.authenticate);
usersRouter.patch('/updateNickName', authHelper.authenticate, usersController.updateNickName);
usersRouter.get('/profile', authHelper.authenticate, usersController.getProfile);
usersRouter.post('/upsertAchievement', authHelper.authenticate, usersController.upsertAchievement);
usersRouter.post('/createCheckIn', authHelper.authenticate, usersController.createCheckIn)

//achievements routes
achievementsRouter.get('/', achievementsController.getAllAchievements);

module.exports = router
