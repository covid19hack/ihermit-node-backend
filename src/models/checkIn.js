const mongoose = require('mongoose').set('debug', true);

const CheckInSchema = mongoose.Schema({
  isHome: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true 
}
);

module.exports = mongoose.model('CheckIn', CheckInSchema)
