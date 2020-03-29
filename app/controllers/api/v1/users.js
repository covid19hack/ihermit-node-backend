const createError = require('http-errors');

// Models and helpers
const User = require('../../../models/user');
const auth = require('../../../helpers/auth');

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
        auth.authorise(user, req, res, { newUser: false });
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
    userProfile = await User.getProfile(user.id)
    res.json({ ...userProfile })
  } catch (err) {
    next(err)
  }
}
// Profile
const getProfile = async (req, res, next) => {
  try {
    const userProfile = await User.getProfile(req.decodedToken.id)
    res.json({ ...userProfile });
  } catch (err) {
    next(err)
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    changedAchievement = req.body.achievement
    user = await User.updateAchievement(req.decodedToken.id, changedAchievement)
    res.json({ ...user });
  } catch (err) {
    next(err)
  }
};

module.exports = { authenticate, getProfile, updateNickName, updateAchievement, createCheckIn };
