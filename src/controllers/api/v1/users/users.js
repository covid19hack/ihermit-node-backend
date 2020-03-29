const createError = require('http-errors');

// Models and helpers
const User = require('../../../../models/user');
const Achievement = require('../../../../models/achievement');
const auth = require('../../../../helpers/auth');

// Register or Login
const authenticate = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.getUserByEmail(email)
    // Create user if user does not exist
    if (!user) {
      let newUser = new User({
        email: email,
        password: password
      });
      newUser = await User.addUser(newUser)
      auth.authorise(newUser, req, res, { newUser: true });
    } else {
      // User exists, authenticate
      const isMatch = await User.comparePassword(password, user.password)
      if (isMatch) {
        auth.authorise(user, req, res);
      } else {
        throw createError(401, "Wrong password");
      }
    }
  } catch (err) {
    next(err)
  }
};

const updateNickName = async (req, res, next) => {
  try {
    const nickName = req.body.nickName;
    if (nickName === undefined) {
      throw createError(400, "nickName not provided")
    }
    user = await User.getUserById(req.decodedToken.id)
    user = await user.updateNickName(nickName)
    res.json({ nickName: user.nickName })
  } catch (err) {
    next(err)
  }
}

const createCheckIn = async (req, res, next) => {
  try {
    const isHome = req.body.isHome
    if (isHome === undefined) {
      throw createError(400, "isHome not provided")
    }
    user = await User.getUserById(req.decodedToken.id)
    await user.addCheckIn(req.body.isHome)
    res.json({ "streakLength": user.streakLength })
  } catch (err) {
    next(err)
  }
}
// Profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.getProfile(req.decodedToken.id)
    res.json({ user: user });
  } catch (err) {
    next(err)
  }
};

const upsertAchievement = async (req, res, next) => {
  try {
    const expandedAchievement = await Achievement.findById(req.body.achievement.id);
    expandedAchievement.progress = req.body.achievement.progress;
    response = await User.upsertAchievement(req.decodedToken.id, expandedAchievement)
    res.json({ ... response,  success: 'true' });
  } catch (err) {
    next(err)
  }
};

module.exports = { authenticate, getProfile, updateNickName, upsertAchievement, createCheckIn };
