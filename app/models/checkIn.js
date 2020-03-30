const mongoose = require('mongoose').set('debug', true);
const createError = require('http-errors');

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
  updateIsHome: async function () {
    try {
      if (this.isHome == true) {
        throw (createError(400, "this checkIn is already dismissed"))
      }
      this.isHome = true
      return await this.save();
    } catch (err) {
      throw err
    }
  }
}

module.exports = mongoose.model('CheckIn', CheckInSchema)
