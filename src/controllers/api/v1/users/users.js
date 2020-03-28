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
        }
        if (isMatch){
          auth.authorise(user, req, res);
        } else {
          next(createError(401, "Wrong password"));
        }
      });
    }
  });
};

// Profile
const achievements = (req, res, next) => {
  res.json({user: User.getAchievements(req.decodedToken._id)});
};

module.exports = { authenticate, achievements };
