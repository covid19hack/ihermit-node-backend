
defaultAchievements = require('../data/achievements');

const quarantineMilestones = {
  //days: achievemtId
  '1': 3,
  '3': 4,
  '6': 5,
  '28': 7,
  '69': 8,
}

const getAchievementForStreak = (streak) => {
  milestone = Object.keys(quarantineMilestones).find(key => key == streak)
  if (!milestone) return null;
  defaultAchievements.filter(achievement =>  achievement.id == quarantineMilestones[milestone]);
}

module.exports = { getAchievementForStreak }
