const createError = require('http-errors');

// Models and helpers
const CheckIn = require('../../../models/checkIn');
const User = require('../../../models/user');

const updateBreach = async (req, res, next) => {
  try {
    const dismiss = req.body.dismiss
    if (dismiss === undefined) {
      throw createError(400, "dismiss not provided")
    }
    const userId = req.decodedToken.id
    const checkInId = req.params.id;
    let checkIn = await CheckIn.getCheckInById(checkInId)
    if (checkIn.userId != userId) {
      throw createError(403, "Unauthorized")
    }
    const user = await User.getUserById(userId);
    let userProfile
    if (dismiss) {
      checkIn = await checkIn.updateIsHome();
      await user.incrementBreachDismissed();
      userProfile = await user.recalculateStreak()
    } else {
      await checkIn.ignore()
      userProfile = await User.getProfile();
    }
    res.json(userProfile);
  } catch (err) {
    next(err)
  }
}


module.exports = { updateBreach };
