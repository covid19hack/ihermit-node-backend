const createError = require('http-errors');

// Models and helpers
const Achievement = require('../../../models/achievement');

const getAllAchievements = async (req, res, next) => {
  try{
    return res.json( { ...await Achievement.find({}) } );
  } catch (err){
    next (err)
  }
}


module.exports = { getAllAchievements };