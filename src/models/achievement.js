const mongoose = require('mongoose').set('debug', true);
const ObjectId = require('mongodb').ObjectID;
const Schema = mongoose.Schema;

const achievementSchema = Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  goal:{
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Achievement', achievementSchema)
