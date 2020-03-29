const createError = require('http-errors');

// Models and helpers
const CheckIn = require('../../../models/checkIn');
const User = require('../../../models/user');

const updateIsHome = async (req, res, next) => {
  try {
    const isHome = req.body.isHome;
    const userId = req.decodedToken.id
    const checkInId = req.params.id;
    if (isHome === undefined) {
      throw createError(400, "isHome not provided")
    }
    let checkIn = await CheckIn.getCheckInById(checkInId)
    if (checkIn.userId != userId) {
      throw createError(403, "Unauthorized")
    }
    checkIn = await checkIn.updateIsHome(isHome);
    const user = await User.getUserById(userId);
    userProfile = await user.recalculateStreak();
    res.json(userProfile);
  } catch (err) {
    next(err)
  }
}


module.exports = { updateIsHome };
