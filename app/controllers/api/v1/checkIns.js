const createError = require('http-errors');

// Models and helpers
const CheckIn = require('../../../models/checkIn');
const User = require('../../../models/user');

const dismissBreach = async (req, res, next) => {
  try {
    const userId = req.decodedToken.id
    const checkInId = req.params.id;
    let checkIn = await CheckIn.getCheckInById(checkInId)
    if (checkIn.userId != userId) {
      throw createError(403, "Unauthorized")
    }
    checkIn = await checkIn.updateIsHome();
    const user = await User.getUserById(userId);
    await user.incrementBreachDismissed();
    userProfile = await user.recalculateStreak();
    res.json(userProfile);
  } catch (err) {
    next(err)
  }
}


module.exports = { dismissBreach };
