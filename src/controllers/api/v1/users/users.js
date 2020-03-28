const createError = require('http-errors');

// Models and helpers
const User = require('../../../../models/user');
const auth = require('../../../../helpers/auth')

// Register or Login
const authenticate = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) {
      next(err)
    }
    // Create user if user does not exist
    if (!user) {
      let newUser = new User({
        email: email,
        password: password
      });
    
      User.addUser(newUser, (err, user) => {
        if (err) {
          next(err);
        } else {
          auth.authorise(user, req, res, { newUser: true });
        }
      });

    } else {
      // User exists, authenticate
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          next(err);
        } else if (isMatch) {
          auth.authorise(user, req, res);
        } else {
          next(createError(401, "Wrong password"));
        }
      });
    }
  });
};

const updateNickName = (req, res, next) => {
  const nickName = req.body.nickName;
  User.getUserById(req.decodedToken.id, (err, foundUser) => {
    if (err) {
      return next(err)
    } 
    foundUser.updateNickName(nickName, (err, saved) => {
      if (err) {
        next(err)
      } else {
        res.json({ nickName: saved.nickName })
      }
    });
  });
}

// Profile
const getProfile = (req, res, next) => {
  res.json({ user: User.getProfile(req.decodedToken.id) });
};

module.exports = { authenticate, getProfile, updateNickName };
