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
    user = await User.getUserById(req.decodedToken.id)
    user = await user.updateNickName(nickName)
    res.json({ nickName: user.nickName })
  } catch (err) {
    next(err)
  }
}

// Profile
const getProfile = async (req, res, next) => {
  res.json({ user: User.getProfile(req.decodedToken.id) });
};

const upsertAchievement = async (req, res, next) => {
  try{
    let expandedAchievement = await Achievement.findById(req.achievement.id);
    expandedAchievement.progress = req.achievement.progress;
    response = await User.upsertAchievement(req.decodedToken.id)
    res.json({ ... response,  success: 'true' });
  } catch(err){
    next(err)
  }
};

module.exports = { authenticate, getProfile, updateNickName, upsertAchievement };
