const mongoose = require('mongoose').set('debug', true);
const ObjectId = require('mongodb').ObjectID;
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = Schema({
  email: {
    type: String,
    index: true,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickName: {
    type: String,
    trim: true,
    default: '' 
  },
  achievements: [String]
});

UserSchema.statics = {
  getUserById:  function (id, callback) {
    this.findById(id, callback);
  },

  getUserByEmail: function (email, callback) {
    const query = {email: email}
    this.findOne(query, callback);
  },

  addUser: function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  },

  comparePassword: function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  },

  getAchievements: function (userId) {
    return this.findById(userId).achievements;
  }
}

UserSchema.methods = {
  updateNickName: function (nickName, callback) {
    this.nickName = nickName
    this.save(callback);
  }
}

module.exports = mongoose.model('User', UserSchema)
