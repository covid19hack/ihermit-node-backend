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
  }],
  points: {
    type: Number,
    default: 0
  },
  achievements: [{
    achievementid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    progress: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
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

  getProfile: async function (userId) {
    try {
      const userProfile = await this.findById(userId).select('-password -checkIns').populate('achievements');
      const breaches = await this.getBreaches(userId);
      return {
        userProfile,
        ...breaches
      }
    } catch (err) {
      throw err
    }
  },

  getBreaches: async function (userId) {
    try {
      const response = await this.findById(userId).select('checkIns').populate('checkIns')
      const checkIns = response.checkIns
      const breaches = []
      for (let i = 0; i < checkIns.length; i++) {
        if (!checkIns[i].isHome) {
          breaches.push(checkIns[i])
        }
      }
      return { "breaches": breaches }
    } catch (err) {
      throw err
    }
  },

  upsertAchievement: async function (userId) {
    try {
      completed = req.expandedAchievement.progress >= req.expandedAchievement.goal;
      const achievement = {
        _id: req.achievement.id,
        progress: req.progress,
        completed: completed
      }
      user =  await this.findById(userId)
      user.achievements.push(achievement)
      if(completed) user.points += req.expandedAchievement.points
      savedUser = await user.save;
      return { points: savedUser.points, completed: completed }
    } catch (err) {
      throw err
    }
  },
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
        userId: this.id,
        isHome: isHome
      })
      checkIn = await checkIn.save()
      this.checkIns.push(checkIn);
      if (!this.streakStartDate || isHome === false) {
        this.streakStartDate = checkIn.createdAt
      }
      const diffDays = Math.ceil((checkIn.createdAt - this.streakStartDate) / (1000 * 60 * 60 * 24))
      this.streakLength = diffDays;
      await this.save()
    } catch (err) {
      throw err
    }
  },

  recalculateStreak: async function () {
    try {
      const response = await this.constructor.findById(this.id).select('checkIns').populate('checkIns')
      const checkIns = response.checkIns
      const len = checkIns.length
      if (len < 1) {
        return await this.constructor.getProfile(this.id)
      }
      if (!checkIns[len - 1].isHome) {
        return await this.constructor.getProfile(this.id)
      }
      
      const calcEarliestValidCheckIn = (ckns) => {
        let earliestValidCheckIn = ckns[len - 1]
        for (let i = len - 1; i >= 0; i--) {
          if (!ckns[i].isHome) {
            return earliestValidCheckIn
          }
          earliestValidCheckIn = ckns[i]
        }
        return earliestValidCheckIn;
      }

      const earliestCheckIn = calcEarliestValidCheckIn(checkIns);
      const lastCheckIn = checkIns[len - 1];
      const diffDays = Math.ceil((lastCheckIn.createdAt - earliestCheckIn.createdAt) / (1000 * 60 * 60 * 24))
      this.streakLength = diffDays;
      this.streakStartDate = earliestCheckIn.createdAt;
      await this.save()
      return await this.constructor.getProfile(this.id);
    } catch (err) {
      throw err
    }
  },
}

module.exports = mongoose.model('User', UserSchema)
