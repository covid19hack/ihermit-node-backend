const createError = require('http-errors');

// Models and helpers
const User = require('../../../../models/user');
const auth = require('../../../../helpers/auth')

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
      auth.authorise(user, req, res, { newUser: true });
    } else {
      const isMatch = await User.comparePassword(password, user.password)
      // User exists, authenticate
      if (isMatch) {
        auth.authorise(user, req, res);
      } else {
        next(createError(401, "Wrong password"));
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
    res.json("message: ok")
  } catch (err) {
    next(err)
  }
}
// Profile
const getProfile = (req, res, next) => {
  res.json({ user: User.getProfile(req.decodedToken.id) });
};

module.exports = { authenticate, getProfile, updateNickName, createCheckIn };
