const users = require('express').users();

//models
const User = require('./models/user');
const appHelper = require('./helpers/app')

// Register
users.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      appHelper.authorise(user, req, res);
    }
  });
});

users.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        appHelper.authorise(user, req, res);
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
users.get('/achievements', appHelper.authenticate, (req, res, next) => {
  res.json({user: User.getAchievements(req.decodedToken._id)});
});

module.exports = users;
