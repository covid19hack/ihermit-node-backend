const mongoose = require('mongoose').set('debug', true);
const CheckIn = require('./checkIn');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
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
  streakStartDate: {
    type: Date
  },
  streakLength: {
    type: Number,
    default: 0
  },
  checkIns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CheckIn"
  }]
});

UserSchema.statics = {
  getUserById: async function (id) {
    try {
      return await this.findById(id);
    } catch (err) {
      throw err
    }
  },

  getUserByEmail: async function (email) {
    try {
      const query = { email: email }
      return await this.findOne(query);
    } catch (err) {
      throw err
    }
  },

  addUser: async function (newUser) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(newUser.password, salt)
      newUser.password = hash
      return await newUser.save()
    } catch (err) {
      throw err
    }
  },

  comparePassword: async function (candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword)
    } catch (err) {
      throw err
    }
  },

  getAchievements: async function (userId) {
    try {
      const user = await this.findById(userId)
      return await user.achievements
    } catch (err) {
      throw err
    }
  },

  // getProfile: async function (userId) {
  //   try {
      
  //   } catch (err) {

  //   }
  // }
}

UserSchema.methods = {
  updateNickName: async function (nickName) {
    try {
      this.nickName = nickName
      return await this.save();
    } catch (err) {
      throw err
    }
  },

  addCheckIn: async function (isHome) {
    try {
      checkIn = new CheckIn({
        isHome: isHome
      })
      checkIn = await checkIn.save()
      this.checkIns.push(checkIn);
      if (!this.streakStartDate ) {
        this.streakStartDate = checkIn.createdAt
      }
      const diffDays = Math.ceil((checkIn.createdAt - this.streakStartDate) / (1000 * 60 * 60 * 24))
      this.streakLength = diffDays;
      return await this.save()
    } catch (err) {
      throw err
    }
  }
}

module.exports = mongoose.model('User', UserSchema)
