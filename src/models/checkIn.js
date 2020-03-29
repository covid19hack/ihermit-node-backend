const mongoose = require('mongoose').set('debug', true);

const CheckInSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isHome: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true 
}
);

CheckInSchema.statics = {
  getCheckInById: async function (id) {
    try {
      return await this.findById(id);
    } catch (err) {
      throw err
    }
  }
}

CheckInSchema.methods = {
  updateIsHome: async function (isHome) {
    try {
      this.isHome = isHome
      return await this.save();
    } catch (err) {
      throw err
    }
  }
}

module.exports = mongoose.model('CheckIn', CheckInSchema)
